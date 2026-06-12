#!/usr/bin/env node

/**
 * SmoothSwitch — Weekly Capacity Report
 *
 * Queries Prometheus HTTP API for key metrics and sends a formatted
 * report via webhook (Slack / WhatsApp / Email).
 *
 * Schedule: Every Monday at 08:00 AM via crontab
 *   0 8 * * 1  cd /opt/smoothswitch/monitoring && node capacity-report.js
 *
 * Environment variables:
 *   PROMETHEUS_URL  — Base URL of Prometheus (default: http://localhost:9090)
 *   WEBHOOK_URL     — Slack / WhatsApp webhook URL for report delivery
 */

const axios = require("axios");

const PROMETHEUS_URL =
  process.env.PROMETHEUS_URL || "http://localhost:9090";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

// ─────────────────────────────────────────────────────────────────────
// Prometheus query helpers
// ─────────────────────────────────────────────────────────────────────

async function queryPrometheus(promql) {
  const url = `${PROMETHEUS_URL}/api/v1/query`;
  try {
    const res = await axios.get(url, { params: { query: promql } });
    if (res.data.status === "success" && res.data.data.result.length > 0) {
      return res.data.data.result;
    }
    return [];
  } catch (err) {
    console.error(`Prometheus query failed: ${promql}`, err.message);
    return [];
  }
}

function extractValue(result, fallback = "N/A") {
  if (result.length > 0 && result[0].value) {
    return parseFloat(result[0].value[1]).toFixed(2);
  }
  return fallback;
}

function extractByLabel(result, labelKey) {
  return result.map((r) => ({
    label: r.metric[labelKey] || "unknown",
    value: parseFloat(r.value[1]).toFixed(2),
  }));
}

// ─────────────────────────────────────────────────────────────────────
// Metric collection
// ─────────────────────────────────────────────────────────────────────

async function collectMetrics() {
  const [
    avgCpu,
    peakMemory,
    totalApiErrors,
    totalSwitches,
    switchSuccessRate,
    mnoPool,
    p99Latency,
    kafkaLag,
  ] = await Promise.all([
    // Average CPU usage across all services (last 7 days)
    queryPrometheus(
      'avg(rate(process_cpu_seconds_total[7d])) by (job) * 100'
    ),

    // Peak memory usage (last 7 days)
    queryPrometheus(
      'max_over_time(process_resident_memory_bytes[7d]) / 1024 / 1024'
    ),

    // Total 5xx errors in the last 7 days
    queryPrometheus(
      'sum(increase(http_requests_total{code=~"5.."}[7d]))'
    ),

    // Total network switches in the last 7 days
    queryPrometheus('sum(increase(network_switches_total[7d]))'),

    // Network switch success rate
    queryPrometheus(
      'sum(increase(network_switches_total{status="success"}[7d])) / sum(increase(network_switches_total[7d])) * 100'
    ),

    // MNO pool levels (current)
    queryPrometheus("mno_pool_available_sims"),

    // p99 API latency
    queryPrometheus(
      'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[7d])) by (job, le))'
    ),

    // Kafka consumer lag
    queryPrometheus("kafka_consumer_group_lag"),
  ]);

  return {
    avgCpu: extractByLabel(avgCpu, "job"),
    peakMemory: extractByLabel(peakMemory, "job"),
    totalApiErrors: extractValue(totalApiErrors, "0"),
    totalSwitches: extractValue(totalSwitches, "0"),
    switchSuccessRate: extractValue(switchSuccessRate, "N/A"),
    mnoPool: extractByLabel(mnoPool, "mno"),
    p99Latency: extractByLabel(p99Latency, "job"),
    kafkaLag: extractByLabel(kafkaLag, "group"),
  };
}

// ─────────────────────────────────────────────────────────────────────
// Report formatting
// ─────────────────────────────────────────────────────────────────────

function formatReport(metrics) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const lines = [
    `📊 *SmoothSwitch Weekly Capacity Report*`,
    `📅 ${weekStart.toISOString().slice(0, 10)} → ${now.toISOString().slice(0, 10)}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `*🖥️ CPU Usage (avg %)*`,
    ...metrics.avgCpu.map((m) => `  • ${m.label}: ${m.value}%`),
    ``,
    `*💾 Peak Memory (MB)*`,
    ...metrics.peakMemory.map((m) => `  • ${m.label}: ${m.value} MB`),
    ``,
    `*❌ Total API Errors (5xx)*: ${metrics.totalApiErrors}`,
    ``,
    `*🔄 Network Switches*`,
    `  • Total: ${metrics.totalSwitches}`,
    `  • Success Rate: ${metrics.switchSuccessRate}%`,
    ``,
    `*📶 MNO Pool Levels (current)*`,
    ...metrics.mnoPool.map((m) => `  • ${m.label}: ${m.value} SIMs`),
    ``,
    `*⏱️ API Latency (p99)*`,
    ...metrics.p99Latency.map((m) => `  • ${m.label}: ${m.value}s`),
    ``,
    `*📨 Kafka Consumer Lag*`,
    ...(metrics.kafkaLag.length > 0
      ? metrics.kafkaLag.map((m) => `  • ${m.label}: ${m.value}`)
      : ["  • No lag data available"]),
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `_Generated automatically by capacity-report.js_`,
  ];

  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────
// Delivery
// ─────────────────────────────────────────────────────────────────────

async function sendReport(report) {
  // Print to console (always)
  console.log(report);

  // Send via webhook if configured
  if (!WEBHOOK_URL) {
    console.warn(
      "\n⚠️  WEBHOOK_URL not set — report printed to console only."
    );
    return;
  }

  try {
    await axios.post(WEBHOOK_URL, {
      text: report, // Slack format
      // For WhatsApp / other webhooks, adjust the payload structure
    });
    console.log("\n✅ Report sent successfully via webhook.");
  } catch (err) {
    console.error("\n❌ Failed to send report:", err.message);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔍 Querying Prometheus for weekly metrics...\n");

  const metrics = await collectMetrics();
  const report = formatReport(metrics);
  await sendReport(report);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
