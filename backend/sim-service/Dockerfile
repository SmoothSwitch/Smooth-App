# ── Build stage ─────────────────────────────────────────────────
FROM golang:alpine AS builder

RUN apk add --no-cache git protobuf protobuf-dev
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.33.0
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.3.0

# Add GOPATH/bin to PATH so we can use the installed plugins
ENV PATH="$PATH:/go/bin"

WORKDIR /app

COPY . .
RUN protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/switch.proto
RUN go mod tidy

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /sim-service .

# ── Run stage ───────────────────────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 1001 appuser

COPY --from=builder /sim-service /usr/local/bin/sim-service

USER appuser

EXPOSE 50051

CMD ["sim-service"]
