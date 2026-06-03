# Blog Post Generator — Multi-Agent Content Pipeline

A 3-agent system that outlines, researches, and writes deep-dive technical articles using a 3-agent dependency graph.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## What It Does

This system uses a **3-Agent Directed Acyclic Graph (DAG)** to divide writing responsibilities, creating a highly cohesive and factual blog post:

```
Topic/Goal (e.g., "The Rise of Multi-Agent Systems")
       ↓
PlannerAgent (designs section titles & target topics in JSON)
       ↓
ResearcherAgent (loops & researches each planned section in detail)
       ↓
WriterAgent (compiles research notes into a publication-ready markdown article)
       ↓
Final Markdown Output
```

---

## Key Features

1. **Topological DAG Ordering**: Uses Kahn's algorithm topological sorting to execute Planner → Researcher → Writer in sequence.
2. **Contextual Loop Researching**: ResearcherAgent reads the planned outline from the Blackboard and queries the LLM sequentially for each topic, keeping context clean and focused.
3. **Structured Context Sharing**: All data (outlines, summaries, notes) is passed via a centralized `Blackboard` state manager.
4. **Cost Tracking & Budgets**: Prevents API bill runaway by aborting execution if costs cross the limit.
5. **Response Caching**: Fast re-runs and zero token usage for identical prompts.

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

### 3. Run Content Generation
Run the pipeline with your target topic:
```bash
node index.js --topic "The Role of Agentic Workflows in Software Engineering"
```

**Output**: Generates a file named `blog-post-the-role-of-agentic-workflows-in-software-engineering.md` in the root directory.

---

## Command Line Options

```bash
# Generate content and output to a custom location
node index.js --topic "Web Development in 2027" --output reports/webdev-trends.md
```

---

## Core Architecture & Design Decisions

### 1. The Blackboard Pattern
Agents do not maintain private state. They share access to a centralized, append-only `Blackboard` instance.
- **PlannerAgent** creates the layout and stores it in the `outline` artifact.
- **ResearcherAgent** reads the `outline` and updates the `research_summaries` artifact.
- **WriterAgent** accesses both `outline` and `research_summaries` to write the cohesive article.

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
- [Pattern 02 — Multi-Provider LLM Routing](../../agentic-patterns/docs/02-multi-provider-llm-routing.md)
