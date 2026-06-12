# Distributed Tracing Setup Guide — SmoothSwitch

Jaeger is already included in `docker-compose.yml`. This guide covers **instrumenting the Go services** with OpenTelemetry and **propagating correlation IDs**.

---

## 1. OpenTelemetry Dependencies

Add these to each Go service's `go.mod`:

```bash
go get go.opentelemetry.io/otel@v1.24.0
go get go.opentelemetry.io/otel/sdk@v1.24.0
go get go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc@v1.24.0
go get go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc@v0.49.0
```

---

## 2. Initialize Tracing in NIE Engine `main.go`

Create or update `backend/nie-engine/cmd/main.go`:

```go
package main

import (
    "context"
    "log"
    "os"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
)

func initTracer() func() {
    ctx := context.Background()

    // OTLP exporter → Jaeger via gRPC (port 4317)
    jaegerEndpoint := os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    if jaegerEndpoint == "" {
        jaegerEndpoint = "jaeger:4317"
    }

    exporter, err := otlptracegrpc.New(ctx,
        otlptracegrpc.WithEndpoint(jaegerEndpoint),
        otlptracegrpc.WithInsecure(),
    )
    if err != nil {
        log.Fatalf("failed to create OTLP exporter: %v", err)
    }

    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(exporter),
        sdktrace.WithResource(resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceNameKey.String("nie-engine"),
            semconv.DeploymentEnvironmentKey.String("production"),
        )),
    )

    otel.SetTracerProvider(tp)
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{},
        propagation.Baggage{},
    ))

    return func() {
        if err := tp.Shutdown(ctx); err != nil {
            log.Printf("error shutting down tracer provider: %v", err)
        }
    }
}

func main() {
    cleanup := initTracer()
    defer cleanup()

    // ... rest of NIE Engine initialization
    log.Println("NIE Engine started with distributed tracing enabled")
}
```

Use the **same pattern** for `relay-proxy` — just change the service name to `"relay-proxy"`.

---

## 3. X-Correlation-ID Header Propagation

### 3a. gRPC Interceptors

Add OpenTelemetry gRPC interceptors to all gRPC clients and servers:

```go
import "go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"

// Server
grpcServer := grpc.NewServer(
    grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
    grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()),
)

// Client
conn, err := grpc.Dial(target,
    grpc.WithUnaryInterceptor(otelgrpc.UnaryClientInterceptor()),
    grpc.WithStreamInterceptor(otelgrpc.StreamClientInterceptor()),
)
```

### 3b. Kafka Message Propagation

Inject trace context into Kafka message headers when publishing:

```go
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/propagation"
)

type KafkaHeaderCarrier []kafka.Header

func (c *KafkaHeaderCarrier) Get(key string) string {
    for _, h := range *c {
        if h.Key == key {
            return string(h.Value)
        }
    }
    return ""
}

func (c *KafkaHeaderCarrier) Set(key, value string) {
    *c = append(*c, kafka.Header{Key: key, Value: []byte(value)})
}

func (c *KafkaHeaderCarrier) Keys() []string {
    keys := make([]string, len(*c))
    for i, h := range *c {
        keys[i] = h.Key
    }
    return keys
}

// When publishing a message:
func publishWithTrace(ctx context.Context, topic string, payload []byte) {
    headers := KafkaHeaderCarrier{}
    otel.GetTextMapPropagator().Inject(ctx, &headers)

    msg := &kafka.Message{
        TopicPartition: kafka.TopicPartition{Topic: &topic},
        Value:          payload,
        Headers:        []kafka.Header(headers),
    }
    producer.Produce(msg, nil)
}
```

Extract on the consumer side:

```go
// When consuming a message:
func consumeWithTrace(msg *kafka.Message) context.Context {
    headers := KafkaHeaderCarrier(msg.Headers)
    ctx := otel.GetTextMapPropagator().Extract(context.Background(), &headers)
    return ctx
}
```

### 3c. Custom X-Correlation-ID Middleware

For HTTP services (auth-service, wallet-service), add middleware that reads/generates correlation IDs:

```go
func correlationIDMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        correlationID := r.Header.Get("X-Correlation-ID")
        if correlationID == "" {
            correlationID = uuid.New().String()
        }
        ctx := context.WithValue(r.Context(), "correlation-id", correlationID)
        w.Header().Set("X-Correlation-ID", correlationID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

---

## 4. Verify Tracing

1. Start the stack: `docker compose up -d`
2. Open Jaeger UI: [http://localhost:16686](http://localhost:16686)
3. Select service `nie-engine` from the dropdown
4. Trigger a network switch and observe end-to-end traces spanning gRPC calls and Kafka messages

---

## 5. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `jaeger:4317` | Jaeger OTLP gRPC endpoint |
| `OTEL_SERVICE_NAME` | (set in code) | Overrides service name |
