# Weekly Capacity Report Setup — SmoothSwitch

## Overview

A Node.js script that queries Prometheus every Monday at 8 AM, collects the past week's key metrics, and delivers a formatted report via Slack/WhatsApp webhook.

---

## 1. Install Dependencies

```bash
cd monitoring/
npm install
```

---

## 2. Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PROMETHEUS_URL` | No | `http://localhost:9090` | Prometheus HTTP API base URL |
| `WEBHOOK_URL` | Yes | _(none)_ | Slack incoming webhook or WhatsApp webhook URL |

---

## 3. Test Manually

```bash
# Print report to console (no webhook)
PROMETHEUS_URL=http://localhost:9090 node capacity-report.js

# Send to Slack
PROMETHEUS_URL=http://localhost:9090 \
WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx \
node capacity-report.js
```

---

## 4. Schedule with Crontab

Run the report every **Monday at 8:00 AM**:

```bash
crontab -e
```

Add this line:

```cron
0 8 * * 1 cd /opt/smoothswitch/monitoring && PROMETHEUS_URL=http://localhost:9090 WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL node capacity-report.js >> /var/log/smoothswitch-capacity-report.log 2>&1
```

---

## 5. Metrics Collected

| Metric | PromQL | Period |
|---|---|---|
| Avg CPU % | `avg(rate(process_cpu_seconds_total[7d])) by (job)` | 7 days |
| Peak Memory (MB) | `max_over_time(process_resident_memory_bytes[7d])` | 7 days |
| Total API Errors | `sum(increase(http_requests_total{code=~"5.."}[7d]))` | 7 days |
| Network Switches | `sum(increase(network_switches_total[7d]))` | 7 days |
| Switch Success % | Success / Total * 100 | 7 days |
| MNO Pool Levels | `mno_pool_available_sims` | Current |
| p99 Latency | `histogram_quantile(0.99, ...)` | 7 days |
| Kafka Consumer Lag | `kafka_consumer_group_lag` | Current |

---

## Pending from Kosi
- [ ] Slack or WhatsApp webhook URL for report delivery
