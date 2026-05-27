# Agentic Systems — Multi-Agent Orchestration Templates

**5 clonable, production-ready AI agent systems** designed for developers, built using standard Node.js (CommonJS) and optimized for recruiters, technical leads, and AI builders. 

Each repository showcases enterprise-grade agentic design patterns—including **DAG Orchestration**, **Centralized Blackboard state management**, **Multi-Provider LLM Fallbacks**, and **Response Caching**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)

---

## 🛸 The Showcase Systems

All systems are fully runnable locally with **zero cost** using Ollama, or configurable with cloud providers (Gemini, OpenRouter, OpenAI, Anthropic).

| System | Architecture | Key Patterns Highlighted | Target Use Case |
| :--- | :--- | :--- | :--- |
| 📂 **[01 — Research Agent](./01-research-agent)** | Single Agent | Multi-provider routing, Response Caching, Budget Guards | Automates deep-dive topic research to markdown summaries. |
| 📂 **[02 — Code Reviewer](./02-code-reviewer)** | 2-Agent DAG | DAG Coordination, Graph context, JSON Output validation | Automated code audit and concrete refactoring generator. |
| 📂 **[03 — Blog Post Generator](./03-blog-post-generator)** | 3-Agent DAG | Loop section-by-section research, Artifact chaining | Outlines, researches, and writes comprehensive blog articles. |
| 📂 **[04 — Test Case Generator](./04-test-case-generator)** | Single Agent | Regex JSON parser, Cache Hit saves, Unit test scaffolding | Signature + Docstring parsing to complete Jest test suites. |
| 📂 **[05 — Bug Triage System](./05-bug-triage)** | 2-Agent DAG | Classifier-Router pattern, Confidence scoring | GitHub bug reports categorized and assigned to teams automatically. |

---

## 🎓 Learning Paths

### Beginner Path (Start Here)
Follow this sequence to learn multi-agent patterns progressively:

1. **[01 — Research Agent](./01-research-agent)** (Single agent, simplest)
   - Learn: Blackboard state, multi-provider routing, response caching
   - Run: `node index.js --topic "machine learning"` → markdown file
   - Time: 10 minutes

2. **[04 — Test Case Generator](./04-test-case-generator)** (Single agent, different pattern)
   - Learn: Input/output validation, LLM → structured output parsing
   - Run: `node index.js --file src/core/BaseAgent.js --function execute`
   - Time: 10 minutes

3. **[05 — Bug Triage System](./05-bug-triage)** (2-agent DAG, intro to multi-agent)
   - Learn: DAGRunner, agent coordination, context passing between agents
   - Run: `node index.js --issue "Users can't log in"`
   - Time: 15 minutes

4. **[03 — Blog Post Generator](./03-blog-post-generator)** (3-agent DAG, complex)
   - Learn: Looping within DAGs, artifact chaining, real-world complexity
   - Run: `node index.js --topic "AI in 2027"`
   - Time: 20 minutes

5. **[02 — Code Reviewer](./02-code-reviewer)** (2-agent DAG, advanced patterns)
   - Learn: Graph context (reading other agents' output), refactoring suggestions
   - Run: `node index.js --file src/core/BaseAgent.js`
   - Time: 15 minutes

**Total beginner path**: ~70 minutes, covers all core patterns

### Advanced Path (For Architects)
If you already understand agents:
- Jump straight to [02 — Code Reviewer](./02-code-reviewer) to see DAG coordination
- Read [agentic-patterns](https://github.com/shubham0086/agentic-patterns) docs (theory behind these systems)
- Modify a system: add a 4th agent to Blog Post Generator (Reviewer agent that quality-checks drafts)

---

## ⚙️ Standardized Core Architecture

Every template in this repository uses a unified core directory (`src/core/`) to maintain consistency and ease of learning:

1. **`Blackboard.js` (State Manager)**:
   - Centralized, append-only state store.
   - Prevents race conditions and ensures agents never mutate state directly.
   - Active cost calculation and **Budget Guard** (throws `Error` immediately if usage crosses a set USD threshold).
2. **`BaseAgent.js` (LLM Engine)**:
   - Out-of-the-box support for `Ollama` (local, free), `OpenCode`, `OpenRouter`, `Gemini`, `OpenAI`, and `Anthropic`.
   - **Session-Level Response Caching** (SHA-256 keyed) to eliminate redundant LLM API hits.
   - **Circuit Breaker fallback**: automatically routes to the next model in a custom priority list if a provider times out or fails.
3. **`DAGRunner.js` (Orchestrator)**:
   - Implements **Kahn's Algorithm** for topological sorting.
   - Handles parallel and sequential execution of agents based on declared dependencies.

---

## 🚀 Quick Start (Local Ollama Execution)

To run any of the templates for free on your local machine:

### 1. Prerequisites
Install [Ollama](https://ollama.com) and pull your model:
```bash
ollama pull qwen2.5-coder:7b
```

### 2. Run a System
Choose a system directory (e.g., Code Reviewer), install dependencies, copy environment configs, and run:
```bash
cd 02-code-reviewer
npm install
cp .env.example .env
node index.js --file src/core/BaseAgent.js
```

**Output**: Outputs a structured `review-BaseAgent.md` report showing violations, improvements, style comments, and refactored code snippets.

---

## 🎯 Production Engineering Decisions

- **Vulnerability Minimization**: API keys are loaded solely through `.env` configs. The `.env` pattern is strictly ignored in git, with placeholders documented in `.env.example`.
- **Parsing Robustness**: Instead of vulnerable raw JSON parsing on freeform LLM outputs, the core utilizes `BaseAgent.cleanJSON`, which strips markdown wrappers and extracts structured JSON reliably.
- **Observability Built-In**: Each system includes a `memory/reality/` folder containing ground-truth YAML specifications detailing claims about what the code does and the exact commands to verify them.

---

## 📚 Study Guides & Implementation Links
- **Pattern 01 (DAG Coordination)**: See [02 — Code Reviewer](./02-code-reviewer) and [03 — Blog Post Generator](./03-blog-post-generator).
- **Pattern 02 (LLM Fallbacks)**: See `src/core/BaseAgent.js` across all folders.
- **Pattern 05 (Caching & Evals)**: See [04 — Test Case Generator](./04-test-case-generator) and `memory/reality/` YAML validations.

---

## License
Licensed under the [MIT License](LICENSE)—feel free to fork, adapt, and build commercial products on top of these templates!
