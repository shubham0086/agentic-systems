# Test Case Generator — Automated Unit Testing

**Clonable System 04** — An automated test generation tool that parses function signatures and docstrings to write comprehensive Jest test suites covering happy paths, edge cases, and error handling.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What It Does

This system analyzes a specific function inside a source code file and generates a complete, clean, ready-to-run Jest unit test suite:

```
Target File + Function Name (e.g., "calculateCompoundInterest")
       ↓
TestGeneratorAgent (static code analyzer & Jest expert)
       ↓
tests/calculateCompoundInterest.test.js (includes mock fixtures & edge cases)
```

---

## Key Features

1. **Targeted Code Analysis**: Focuses unit test generation on a specific function, avoiding context bloat from entire repositories.
2. **Comprehensive Test Scaffolding**: Automatically outputs structured tests for happy paths, edge cases (boundaries, empty states), and error catching.
3. **Regex JSON/Code Isolation**: Employs robust extraction algorithms to isolate unit test code blocks from conversational LLM outputs.
4. **Multi-Provider Fallback**: Tries local LLMs (Ollama) first, then falls back to cloud providers (Gemini, OpenRouter, OpenAI, Anthropic).
5. **Cost Enforcement**: Implements budget checks to prevent excessive resource consumption.

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

### 3. Run Test Generator
Generate tests for a function inside a source file:
```bash
node index.js --file src/core/Blackboard.js --function summary
```

**Output**: Generates a test suite at `tests/summary.test.js` in the root directory.

---

## Command Line Options

```bash
# Generate tests and write output to a custom location
node index.js --file src/core/BaseAgent.js --function cleanJSON --output spec/cleanJSON.spec.js
```

---

## Core Architecture & Design Decisions

### 1. Caching & Fast Iteration
The system includes session-level prompt hashing. If you regenerate tests for the same function and file, the output resolves instantly from the cache, avoiding duplicate API costs.

### 2. Standardized Core
This system implements the exact same `BaseAgent.js` and `Blackboard.js` core as the other systems in this series, demonstrating consistent design patterns that are easy to maintain and scale.

---

## Stack
- **Runtime**: Node.js (CommonJS)
- **Dependencies**: `dotenv`, `js-yaml`
- **Supported Providers**: Ollama, OpenCode, OpenRouter, Gemini, OpenAI, Anthropic

---

## See Also
- [Pattern 05 — RAG That Doesn't Suck](../../agentic-patterns/docs/05-rag-that-doesnt-suck.md)
