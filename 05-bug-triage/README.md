# Bug Triage System — Automated Issue Routing

An automated ticket routing and bug classification system that uses a 2-agent Directed Acyclic Graph (DAG) to parse inbound issues, classify severity and component, and assign them to the correct engineering team with debugging next steps.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What It Does

This system uses a **2-Agent Directed Acyclic Graph (DAG)** to automate issue triage and ticket routing, ensuring tickets are processed with high accuracy and confidence:

```
Inbound GitHub Issue / Bug Report
       ↓
ClassifierAgent (evaluates severity & determines component tags)
       ↓
[Classification Results & Issue]
       ↓
RouterAgent (allocates to correct engineering team & details next steps)
       ↓
Structured JSON Triage Report
```

---

## Key Features

1. **DAG Coordination**: Topologically coordinates Classifier → Router execution using Kahn's algorithm.
2. **Deterministic Outputs**: Uses strict JSON formatting with fallback parsing.
3. **Smart Routing Logic**: RouterAgent combines original issue details with structured tags to make intelligent, contextual assignments.
4. **Session-Level Response Caching**: Skips duplicate LLM requests for identical tickets, reducing API expenses.
5. **Cost Guardians**: Aborts execution if the running API costs exceed the specified budget.

---

## Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment
Copy the example environment file and configure your providers (Ollama works out-of-the-box):
```bash
cp .env.example .env
```

### 3. Run Bug Triage
Triage an inbound issue report:
```bash
node index.js --issue "Users are experiencing 504 Gateway Timeout errors during checkout payments"
```

**Output**: Outputs a structured JSON report to the console detailing severity, component, assigned team, reasoning, and next actions.

---

## Command Line Options

```bash
# Triage an issue and save the JSON report to a file
node index.js --issue "Broken logo image on login screen" --output reports/triage-logo.json
```

---

## Core Architecture & Design Decisions

### 1. The Blackboard Pattern
Agents do not maintain private state. They share access to a centralized, append-only `Blackboard` instance.
- **ClassifierAgent** classifies the issue and records the tags under the `classification` artifact on the Blackboard.
- **RouterAgent** depends on `Classifier`, so it reads the notes containing the tags and creates the `routing` artifact.

### 2. Standardized Core
This system implements the exact same `BaseAgent.js` and `Blackboard.js` core as the other systems in this series, demonstrating consistent design patterns that are easy to maintain and scale.

---

## Stack
- **Runtime**: Node.js (CommonJS)
- **Dependencies**: `dotenv`, `js-yaml`
- **Supported Providers**: Ollama, OpenCode, OpenRouter, Gemini, OpenAI, Anthropic

---

## See Also
- [Pattern 01 — DAG Coordination](../../agentic-patterns/docs/01-dag-vs-linear.md)
- [Pattern 05 — RAG That Doesn't Suck](../../agentic-patterns/docs/05-rag-that-doesnt-suck.md)
