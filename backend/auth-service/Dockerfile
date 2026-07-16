# ── Build stage ─────────────────────────────────────────────────
FROM golang:alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /app

COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /auth-service .

# ── Run stage ───────────────────────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 1001 appuser

COPY --from=builder /auth-service /usr/local/bin/auth-service

USER appuser

EXPOSE 4000

CMD ["auth-service"]
