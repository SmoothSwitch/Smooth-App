# UptimeRobot Synthetic Monitors — SmoothSwitch

## Overview

Set up **1-minute interval** HTTP(S) monitors for all 5 core SmoothSwitch services using [UptimeRobot](https://uptimerobot.com/).

---

## 1. Create UptimeRobot Account

1. Sign up at [https://uptimerobot.com](https://uptimerobot.com) (free tier supports 50 monitors)
2. Verify your email address
3. Set up alert contacts (email, Slack webhook, or SMS)

---

## 2. Monitor Configuration

Create the following **5 monitors** with these settings:

| # | Monitor Name | Type | URL | Interval | Expected Status | Keyword |
|---|---|---|---|---|---|---|
| 1 | **Auth Service** | HTTP(S) | `https://<AUTH_SERVICE_URL>/health` | 1 min | 200 | `"status":"ok"` |
| 2 | **Wallet Service** | HTTP(S) | `https://<WALLET_SERVICE_URL>/health` | 1 min | 200 | `"status":"ok"` |
| 3 | **NIE Engine** | HTTP(S) | `https://<NIE_ENGINE_URL>/health` | 1 min | 200 | `"status":"ok"` |
| 4 | **Relay Proxy** | HTTP(S) | `https://<RELAY_PROXY_URL>/health` | 1 min | 200 | `"status":"ok"` |
| 5 | **API Gateway** | HTTP(S) | `https://<API_GATEWAY_URL>/health` | 1 min | 200 | `"status":"ok"` |

> **NOTE**: Replace `<*_URL>` placeholders with the real deployed URLs once Kosi provides them.

---

## 3. Alert Configuration

For each monitor, configure:

- **Alert contacts**: Add your team email + Slack/WhatsApp webhook
- **Alert threshold**: Alert after **2 consecutive failures** (avoids false positives from transient network issues)
- **SSL monitoring**: Enable SSL expiry alerts (30 days before expiry)

---

## 4. Status Page (Optional)

UptimeRobot offers a free public status page:

1. Go to **My Settings → Status Pages → Add Status Page**
2. Name: `SmoothSwitch Status`
3. Add all 5 monitors
4. Share the public URL with your team: `https://stats.uptimerobot.com/smoothswitch`

---

## 5. API-Based Setup (Alternative)

If you prefer to automate monitor creation, use the UptimeRobot API:

```bash
# Get your API key from: My Settings → API Settings → Main API Key

# Create Auth Service monitor
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=YOUR_API_KEY" \
  -d "friendly_name=SmoothSwitch Auth Service" \
  -d "url=https://AUTH_SERVICE_URL/health" \
  -d "type=1" \
  -d "interval=60" \
  -d "alert_contacts=ALERT_CONTACT_ID"

# Repeat for each service...
```

---

## Pending from Kosi
- [ ] Auth Service deployed URL
- [ ] Wallet Service deployed URL
- [ ] NIE Engine deployed URL
- [ ] Relay Proxy deployed URL
- [ ] API Gateway URL
