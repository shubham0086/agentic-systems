# Code Reviewer — Multi-Agent DAG pipeline

**Clonable System 02** — A production-ready code review pipeline that uses a 2-agent Directed Acyclic Graph (DAG) to analyze source files, extract security/architectural violations, and generate concrete refactoring suggestions with before/after diffs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What It Does

This system demonstrates the power of **Directed Acyclic Graph (DAG) Coordination** for code analysis. Unlike single-agent models, this pipeline splits responsibilities:

```
File Path & Code Content
       ↓
ReviewerAgent (static analysis, detects bugs/style issues)
       ↓
[Reviewer Notes & Code]
       ↓
SuggesterAgent (modernization expert, generates refactored code)
       ↓
Combined Markdown Review Report
```

---

## Key Features

1. **DAG Orchestration**: Uses Kahn's algorithm topological sorting to execute agents sequentially based on their dependencies.
2. **Structured JSON Validation**: Enforces clean JSON output from LLMs with robust regex-based extraction and fallback parsing.
3. **Multi-Provider Fallback**: Tries local LLMs (Ollama) first, then falls back to cloud providers (Gemini, OpenRouter, OpenAI, Anthropic).
4. **Session-Level Response Caching**: Saves token costs by caching results on identical code snippets.
5. **Cost Tracking & Budget Guards**: Terminates execution immediately if API usage exceeds the threshold.

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

### 3. Run Code Review
Review any local code file:
```bash
node index.js --file src/core/BaseAgent.js
```

**Output**: Generates a file named `review-BaseAgent.md` in the root directory.

---

## Command Line Options

```bash
# Review a file and output to a custom location
node index.js --file src/core/Blackboard.js --output reports/blackboard-audit.md
```

---

## Core Architecture & Design Decisions

### 1. The Blackboard Pattern
Agents do not communicate directly. They share access to a centralized, append-only `Blackboard` instance.
- **ReviewerAgent** reads the code content and writes its structured findings to the Blackboard notes.
- **SuggesterAgent** is configured to depend on `Reviewer`, so it receives the Blackboard notes from `Reviewer` as input context, alongside the original code.

### 2. Structured Outputs
Instead of parsing freeform markdown, both agents return JSON strings that are cleaned and parsed. If an LLM wraps the response in a markdown code block, `BaseAgent.cleanJSON` safely extracts and parses it.

---

## Stack
- **Runtime**: Node.js (CommonJS)
- **Dependencies**: `dotenv`, `js-yaml`
- **Supported Providers**: Ollama, OpenCode, OpenRouter, Gemini, OpenAI, Anthropic

---

## Troubleshooting

**Ollama Connection Failure**:
Make sure Ollama is installed and running locally with your target model:
```bash
ollama serve
ollama pull qwen2.5-coder:7b
```

---

## See Also
- [Pattern 01 — DAG Coordination](../../agentic-patterns/docs/01-dag-vs-linear.md)
- [Pattern 04 — Graph Context](../../agentic-patterns/docs/04-graphdb-for-agent-context.md)
