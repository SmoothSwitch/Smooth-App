# ── Build stage ─────────────────────────────────────────────────
FROM golang:1.21-alpine AS builder

# Install build dependencies for CGO (required by h3-go and confluent-kafka-go)
RUN apk add --no-cache git build-base musl-dev gcc

WORKDIR /app

# Initialize/tidy Go modules
COPY . .
RUN go mod tidy

# Build the binary with CGO enabled
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o /location-advisory .

# ── Run stage ───────────────────────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 1001 appuser

COPY --from=builder /location-advisory /usr/local/bin/location-advisory

USER appuser

EXPOSE 8000

CMD ["location-advisory"]
