# enterprise-ai-support

Enterprise AI Support Intent Routing & Workflow Automation

---

## Installation

```bash
cd enterprise-ai-support
npm install
```

---

## Build

```bash
npm run build
docker build -t enterprise-ai-support:latest .
```

---

## Run

```bash
npm start
docker-compose up -d
```

---

## Dependencies

- **Runtime**: Node.js Standard Library (>= 18.0.0)
- **Architecture**: Modular domain engines with zero external unverified dependencies

---

## Usage

Access the application and endpoints locally on port **7000**.

---

## Testing & Coverage

```bash
npm test
npm run test:coverage
```


# 🤖 Enterprise-AI-Support: Customer Automation & Intelligent Triage Copilot

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/rohith1246/enterprise-ai-support)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](#license)
[![Architecture](https://img.shields.io/badge/architecture-NLP%20%2F%20Semantic%20RAG-purple.svg)](#architecture)

Enterprise-AI-Support is an enterprise-grade customer support triage and intelligence copilot platform engineered for high-concurrency ticket classification, skills-based agent workload balancing, semantic RAG knowledge retrieval, and real-time customer frustration analytics.

---

## 🏛️ System Architecture

```text
[ Incoming Customer Ticket / Webhook / LiveChat ]
                       │
                       ▼
    +───────────────────────────────────────+
    │     Multi-Class Intent Classifier     │
    │     & Named Entity Recognizer (NER)   │
    +───────────────────────────────────────+
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
+──────────────────────────+  +──────────────────────────+
│ Skills-Based Ticket      │  │ Semantic RAG Knowledge   │
│ Router & Workload Pool   │  │ Base Retrieval (BM25)    │
+──────────────────────────+  +──────────────────────────+
       │                               │
       └───────────────┬───────────────┘
                       ▼
    +───────────────────────────────────────+
    │ Sentiment & Churn Risk Tone Analyzer  │
    +───────────────────────────────────────+
                       │
                       ▼
[ Automated VIP SLA Escalation / Agent Copilot Workspace ]
```

---

## 🚀 Key Engineering Features

### 1. Multi-Class NLP Intent Classification
* **Taxonomy Engine:** Classifies tickets across Billing Disputes, Technical Outages, Account Security, Feature Requests, and GDPR Compliance.
* **Urgency Scoring:** Automatically flags P1 urgent incidents with confidence thresholds.

### 2. Skills-Based Intelligent Ticket Router
* **Workload-Aware Load Balancing:** Dynamic capacity queues preventing agent burnout while maintaining strict SLA response times.
* **Skill Vector Matching:** Routes complex technical escalations directly to certified Tier-3 support engineers.

### 3. Semantic RAG Knowledge Base Retrieval
* **BM25 + Token Similarity:** High-speed keyword tokenization and relevance ranking across 580+ technical troubleshooting articles.
* **Context Injection:** Formulates contextual suggested responses for tier-1 support agents.

### 4. Real-Time Sentiment & Churn Risk Detection
* **Frustration Polarity Heuristics:** Monitors incoming customer dialogue for escalation markers, cancellation threats, and negative sentiment.
* **Proactive VIP Alerts:** Dispatches automated webhooks when high-MRR enterprise clients experience unresolved blockers.

---

## 📂 Repository Layout

```text
enterprise-ai-support/
├── src/
│   ├── engine/
│   │   ├── nlp/               # Intent classification & entity extraction
│   │   ├── routing/           # Skills-based intelligent ticket router
│   │   ├── rag/               # Semantic knowledge base retriever
│   │   └── sentiment/         # Frustration index & churn risk analyzer
│   └── data/
│       ├── tickets/           # 650+ Multi-turn enterprise customer ticket transcripts
│       ├── knowledge/         # 580+ Technical troubleshooting articles
│       ├── agents/            # 450+ Support engineering workforce profiles
│       ├── rules/             # 480+ Automated SLA escalation policies
│       ├── playbooks/         # 450+ Step-by-step SRE incident mitigation playbooks
│       └── analytics/         # 600+ Historical CSAT sentiment time series
├── server/
│   └── gateway/               # Real-time HTTP & WebSocket telemetry gateway
└── tests/
    ├── unit/                  # Unit tests for routing, RAG, and NLP engines
    └── runner.js              # Master test suite runner
```

---

## ⚙️ Getting Started

### Quick Start
```bash
# Clone the repository
git clone https://github.com/rohith1246/enterprise-ai-support.git
cd enterprise-ai-support

# Run all unit test suites
npm test

# Launch the Support Telemetry Gateway
npm start
```
The Support Gateway will initialize on `http://localhost:7000`.

---

## 🔒 License & Intellectual Property
Proprietary & Confidential. All rights reserved by `rohith1246`.
