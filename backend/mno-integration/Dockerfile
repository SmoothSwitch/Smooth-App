# ── Build stage ─────────────────────────────────────────────────
FROM golang:alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

COPY . .
RUN go mod tidy

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /mno-integration .

# ── Run stage ───────────────────────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 1001 appuser

COPY --from=builder /mno-integration /usr/local/bin/mno-integration

# Ensure /tmp/smoothswitch/sftp exists with proper permissions
RUN mkdir -p /tmp/smoothswitch/sftp && chown -R appuser:appuser /tmp/smoothswitch/sftp

USER appuser

EXPOSE 8001

CMD ["mno-integration"]
