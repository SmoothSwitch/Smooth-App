# PagerDuty Integration Setup Guide — SmoothSwitch

## 1. Create PagerDuty Account

1. Go to [PagerDuty](https://www.pagerduty.com/) and sign up for a free account
2. Create a **Service** called `SmoothSwitch Production`
3. Under the service, select **Integrations → Add Integration**
4. Choose **Prometheus** as the integration type
5. Copy the **Integration Key** (a 32-character hex string)

## 2. Configure Prometheus Alertmanager

Create `monitoring/alertmanager.yml` with the following content:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: pagerduty-critical

  routes:
    # Critical alerts → PagerDuty (immediate page)
    - match:
        severity: critical
      receiver: pagerduty-critical
      continue: false

    # Warning alerts → PagerDuty (low urgency, no page)
    - match:
        severity: warning
      receiver: pagerduty-warning
      continue: false

receivers:
  - name: pagerduty-critical
    pagerduty_configs:
      - service_key: '<YOUR_PAGERDUTY_INTEGRATION_KEY>'
        severity: critical
        description: '{{ .CommonAnnotations.summary }}'
        details:
          alert: '{{ .CommonLabels.alertname }}'
          description: '{{ .CommonAnnotations.description }}'

  - name: pagerduty-warning
    pagerduty_configs:
      - service_key: '<YOUR_PAGERDUTY_INTEGRATION_KEY>'
        severity: warning
        description: '{{ .CommonAnnotations.summary }}'
```

## 3. Add Alertmanager to docker-compose.yml

Add the following service to `docker-compose.yml`:

```yaml
  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: smoothswitch-alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    networks:
      - monitoring
```

Then add to your Prometheus config (`monitoring/prometheus.yml`):

```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]
```

## 4. Share Integration Key with Kosi

> **IMPORTANT**: Share the PagerDuty integration key with Kosi so he can store it in **AWS Secrets Manager** under:
> `smoothswitch/prod/pagerduty-integration-key`

## 5. Test the Integration

```bash
# Send a test alert via Alertmanager API
curl -X POST http://localhost:9093/api/v2/alerts \
  -H "Content-Type: application/json" \
  -d '[{
    "labels": { "alertname": "TestAlert", "severity": "warning" },
    "annotations": { "summary": "Test alert from SmoothSwitch" }
  }]'
```

Verify the test alert appears in PagerDuty's incident dashboard.
