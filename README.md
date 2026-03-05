# SmoothSwitch: Unified Multi-Network Mobile Data Platform

SmoothSwitch is a mission-critical platform designed to provide seamless, "always-on" connectivity by intelligently switching between mobile networks (MNOs) without dropping active sessions.

## 📁 Repository Structure

```text
SmoothSwitch/
├── backend/            # Microservices
│   ├── nie-engine/     # Network Intelligence Engine (Go)
│   ├── relay-proxy/    # Always-On Relay Proxy (Go)
│   ├── wallet-service/ # Wallet & Payments (Java)
│   ├── auth-service/   # Identity & Access (Node.js)
│   ├── mno-integration/# MNO Adapters (Python)
│   └── sim-service/    # SIM/eSIM provisioning (Java)
├── frontend/           # Client Applications
│   ├── android/        # Jetpack Compose App
│   ├── ios/            # SwiftUI App
│   └── web-dashboard/  # Next.js Portal
├── infrastructure/     # DevOps & IaC
│   ├── terraform/      # AWS/Azure IaC
│   ├── kubernetes/     # EKS/AKS Manifests
│   └── github-actions/ # CI/CD Pipelines
└── docs/               # Technical Specifications
    └── technical_specs/ # Research & Architecture
```

## 🚀 Core Architecture

- **NIE (Go)**: quality scoring and proactive switching logic.
- **Relay Proxy (Go)**: QUIC-based session continuity.
- **Microservices**: Polyglot stack (Java, Python, Node.js) communicating via Kafka.
- **Cloud**: Multi-region AWS (Primary) and Azure (DR) setup.

## 🛠 Tech Stack

- **Backend**: Go 1.21+, Java 17+, Node.js 20+, Python 3.11+.
- **Database**: PostgreSQL 15, Redis 7.
- **Messaging**: Kafka with Avro Schema Registry.
- **Mobile**: Kotlin (Android), Swift (iOS).

## 📅 Road Map (10-Week Execution)

- **Weeks 1-3**: Contracts & Foundation (Auth, NIE, Infra).
- **Weeks 4-6**: Core Services (Relay, Wallet, Gateway).
- **Weeks 7-8**: Integration & E2E Testing.
- **Weeks 9-11**: Hardening & Production Launch.

---
*Confidential · Smooth Switch · 2025*
