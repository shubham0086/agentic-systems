# Contributing to Agentic Systems

Thanks for your interest in contributing! Agentic Systems are working examples for the patterns documented in [agentic-patterns](https://github.com/shubham0086/agentic-patterns). All contributions—bug fixes, new systems, better examples, docs—are welcome.

---

## Before You Start

**Read this first:**
- [agentic-patterns documentation](https://github.com/shubham0086/agentic-patterns) — understand the theory
- [README.md](README.md) — see all 5 systems at a glance
- The specific system's README in the directory (e.g., `01-research-agent/README.md`)
- **Key rule**: These systems ARE the implementation of patterns. If your change contradicts a documented pattern, don't make it.

---

## Types of Contributions

### 🐛 Bug Fixes
1. **Test locally first** — run the system on your machine to confirm the bug
2. Open an issue describing the bug and how to reproduce it
3. Fork, create a branch: `git checkout -b fix/issue-123-research-agent`
4. Fix the bug
5. Run the system again to verify the fix works
6. Commit: `fix: describe the bug and the fix`
7. Open a PR with a clear description

### ✨ New Systems
1. **Open a discussion** (NOT a PR yet) describing the new system:
   - What problem does it solve?
   - How many agents (single vs DAG)?
   - Which patterns from agentic-patterns does it demonstrate?
2. Wait for feedback — we prioritize systems that teach underrepresented patterns
3. If approved, build it by copying the structure of an existing system (same language, same core layout)
4. Run it locally to verify it works
5. Add a README explaining the system and its entry point
6. Open a PR referencing the discussion

### 📚 Documentation & READMEs
- Typos, unclear explanations, missing examples: PRs welcome directly
- Suggest a new system: start with a discussion issue

### 🔧 Core Improvements
For changes to shared files (`src/core/BaseAgent.js`, `src/core/Blackboard.js`, etc.):
1. **Verify all 5 systems still work** before opening a PR
   - Run `node index.js` (with appropriate args) for each system
   - Verify the output is what's expected
2. **Maintain backward compatibility** — if you change the BaseAgent contract, all systems must still work
3. Update the `TEMPLATE.md` in agentic-patterns if you're changing a core pattern

---

## Development Setup

```bash
# Clone the repo
git clone https://github.com/shubham0086/agentic-systems
cd agentic-systems

# Install Ollama (free, required for dev testing)
# https://ollama.com

# Pull a model
ollama pull qwen2.5-coder:7b

# Run a system (e.g., research agent)
cd 01-research-agent
npm install
cp .env.example .env
node index.js --topic "testing"
```

---

## Testing

### Local Testing
Each system is self-testing. Just run it:

```bash
cd 01-research-agent
node index.js --topic "test topic"
# If output file is created, system works!
```

### Playwright Tests
```bash
cd 01-research-agent
npm test
# Verifies syntax, guardrails, sanitization
```

### System-Specific Tests
Refer to each system's `tests/system.spec.js` for what's being verified.

---

## Code Style

- **Node.js**: CommonJS (not ES modules) for maximum compatibility
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: Only "why" comments in core logic, not "what" comments
- **Max line length**: 100 chars (easy to read on GitHub)
- **Indentation**: 2 spaces

---

## Commit Messages

```
type: short summary (max 50 chars)

Optional longer explanation if the change is complex.
Explain WHY, not just WHAT.

Fixes #issue-number (if applicable)
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example:
```
fix: research agent output not appending to blackboard

Previously, the parseOutput() method in ResearcherAgent was checking
for a malformed artifact key. Now uses correct key from buildPrompt.

Fixes #42
```

---

## Security & Safety

### Before Opening a PR
- [ ] No `.env` files committed (only `.env.example`)
- [ ] No API keys, secrets, or credentials in code/comments
- [ ] No hardcoded server paths or internal hostnames
- [ ] Guardrails tests pass (check for prompt injection, output redaction)
- [ ] No sensitive data logged

**Security check**:
```bash
git log --all -p | grep -iE "(password|secret|api.?key|token|bearer|sk-)" | head
```
If anything hits → don't commit.

---

## PR Review Process

1. **Automated checks** — tests must pass, syntax must be valid
2. **Code review** — we check for:
   - Does it work? (system runs without errors)
   - Does it teach the pattern? (code aligns with agentic-patterns docs)
   - Is it maintainable? (other devs can read and modify it)
   - Is it secure? (no secrets, guardrails in place)
3. **Feedback cycle** — we may ask for changes; no shame in iteration
4. **Merge** — once approved, we'll merge

---

## Big Picture: What Agentic Systems Needs

| Priority | Area | What helps |
|----------|------|-----------|
| ⭐⭐⭐ | **Teaching DAGs** | New 3+ agent system that demonstrates complex coordination (e.g., "Proposal Generator: Planner → Researcher → Writer → Reviewer") |
| ⭐⭐⭐ | **Real-world patterns** | Systems that solve actual vibecoder problems (e.g., "Content Moderator", "Customer Support Classifier") |
| ⭐⭐ | **Docs** | Video walkthroughs of each system, beginner's guide to running locally |
| ⭐⭐ | **Edge cases** | Systems that demonstrate error handling, fallback behavior, budget guards |
| ⭐ | **Language support** | Python equivalents of these Node.js systems (if you're willing to maintain them) |

---

## Questions?

- **How do I add a new agent to an existing system?** → Copy `src/agents/ExistingAgent.js`, change the class name and `systemPrompt()`. Add it to the DAG in `index.js`.
- **How do I handle a new LLM provider?** → Change `PROVIDER_ORDER` in `.env.example` and `BaseAgent.js`. See how `_callOpenAICompat` works.
- **How do I add tests?** → Copy `tests/system.spec.js` from another system, update the file paths.
- **Something else?** → Open a discussion issue.

---

## License

By contributing, you agree your code is licensed under MIT. All code contributions must be your own original work.

---

**Thank you for building with us!** 🚀

*P.S.: These systems were built from 18 months of shipping real AI products. Your contributions make them better for the next 1000 vibecoders.*
