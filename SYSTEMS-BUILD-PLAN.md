# Agentic Systems — Build Plan

**Goal**: Build 5 clonable, runnable agent systems (01–05).

All systems share:
- CommonJS (Node.js 18+)
- Same core structure: `src/core/`, `src/agents/`, `.env.example`, `package.json`
- Blackboard + BaseAgent + multi-provider routing (copy from `01-research-agent`)
- `memory/reality/` with verification commands
- MIT license

---

## System 01 — Research Agent (STARTED)

**Status**: 🟡 Core structure + Researcher agent done. Needs: Ollama testing, minor tweaks.

**Purpose**: Research any topic → markdown summary with sources

**Files to Create/Review**:
```
01-research-agent/
├── package.json                  ✅ DONE
├── .env.example                  ✅ DONE
├── .gitignore                    ✅ DONE
├── README.md                     ✅ DONE
├── index.js                      ✅ DONE (entry point)
├── src/
│   ├── core/
│   │   ├── Blackboard.js         ✅ DONE
│   │   └── BaseAgent.js          ✅ DONE
│   └── agents/
│       └── ResearcherAgent.js    ✅ DONE
└── memory/
    └── reality/
        └── research.yaml         ✅ DONE
```

**Test**:
```bash
cd 01-research-agent
npm install
cp .env.example .env
node index.js --topic "test topic"
# Should produce: research-test-topic.md
```

---

## System 02 — Code Reviewer (PLAN)

**Purpose**: Read code file → structured review (violations + improvements + style)

**Agents** (2 in DAG):
1. **ReviewerAgent**: Reads code, identifies issues
   - Input: file path
   - Output: JSON { violations: [...], improvements: [...], style: [...] }
   - System prompt: "You are a senior code reviewer. Review the code for..."

2. **SuggesterAgent** (parallel, not dependent on Reviewer):
   - Input: code + violations from Reviewer
   - Output: JSON { refactor_suggestions: [...], explanations: [...] }
   - System prompt: "You are a refactoring expert..."

**Entry Point**:
```bash
node index.js --file src/index.js --output review-index.md
```

**Output Format**:
```markdown
# Code Review: src/index.js

## Violations (Critical)
- [line 42] SQL injection risk in query building
- [line 15] Missing error handling in async call

## Improvements (Suggestions)
- Extract database logic to separate module
- Add TypeScript definitions

## Style Issues
- Inconsistent spacing (some 2-space, some 4-space)
- Variable names: use camelCase (found snake_case on line 23)

## Refactor Suggestions
- Consolidate error handlers (3 identical try-catch blocks)
- Move utility functions to utils/
```

**Files to Create**:
```
02-code-reviewer/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── index.js (DAG coordinator: Reviewer → Suggester in parallel)
├── src/
│   ├── core/ (copy from 01-research-agent, identical)
│   │   ├── Blackboard.js
│   │   └── BaseAgent.js
│   └── agents/
│       ├── ReviewerAgent.js
│       └── SuggesterAgent.js
└── memory/
    └── reality/
        └── code-review.yaml
```

**Key Differences from 01**:
- DAGRunner (from agentic-patterns starter-node) instead of single agent
- Two agents coordinating
- Structured JSON output validation (use BaseAgent.cleanJSON())

---

## System 03 — Blog Post Generator (PLAN)

**Purpose**: Outline → Research → Write → Polish blog post

**Agents** (3 in DAG):
1. **PlannerAgent**: Breaks topic into sections
   - Input: topic
   - Output: JSON { sections: [{ title, description }, ...] }

2. **ResearcherAgent**: Research each section
   - Input: outline (from Planner)
   - Output: artifacts with section research

3. **WriterAgent**: Draft blog post
   - Input: research summaries
   - Output: markdown blog post

**DAG**:
```
PlannerAgent
    ↓
ResearcherAgent (parallel per section)
    ↓
WriterAgent
    ↓
Output: blog-post-<timestamp>.md
```

**Entry Point**:
```bash
node index.js --topic "The Future of AI in 2027"
```

**Output**: `blog-post-2026-05-23.md` (publishable, 2000–3000 words)

**Files**:
```
03-blog-post-generator/
├── package.json
├── .env.example
├── README.md
├── index.js (3-agent DAG)
├── src/core/ (copy from 01)
├── src/agents/
│   ├── PlannerAgent.js
│   ├── ResearcherAgent.js (similar to 01 but section-focused)
│   └── WriterAgent.js
└── memory/reality/blog-generation.yaml
```

**Key Pattern**: Pattern 01 (DAG) — demonstrate multi-agent coordination, artifact chaining.

---

## System 04 — Test Case Generator (PLAN)

**Purpose**: Function signature + docstring → test cases + fixtures

**Agents** (1):
- **TestGeneratorAgent**: Reads function, outputs Jest test file

**Entry Point**:
```bash
node index.js --file src/utils/math.js --function calculateCompoundInterest
```

**Output**: `tests/calculateCompoundInterest.test.js` with:
- Happy path tests
- Edge cases
- Error handling
- Fixtures (sample data)

**System Prompt**:
```
You are a test engineer. Given a function signature and docstring, generate comprehensive Jest test cases.

Include:
- Happy path test(s)
- Edge cases (empty input, null, boundary values)
- Error handling (invalid inputs, exceptions)
- Fixtures (realistic test data)

Output ONLY valid JavaScript/Jest code. No preamble.
```

**Files**:
```
04-test-case-generator/
├── package.json
├── .env.example
├── README.md
├── index.js (single agent)
├── src/core/ (copy)
├── src/agents/
│   └── TestGeneratorAgent.js
└── memory/reality/test-generation.yaml
```

**Key Pattern**: Pattern 05 (Response Caching) — same function → same tests, so cache hit on second run.

---

## System 05 — Bug Triage System (PLAN)

**Purpose**: GitHub issue report → severity + component + team routing

**Agents** (2 in DAG):
1. **ClassifierAgent**: Severity + component
   - Input: issue description
   - Output: JSON { severity: "critical|high|medium|low", component: "auth|api|ui|...", confidence: 0-100 }

2. **RouterAgent**: Team suggestion
   - Input: classifier output + original issue
   - Output: JSON { team: "backend|frontend|infra", context: "..." }

**DAG**:
```
ClassifierAgent
    ↓
RouterAgent
    ↓
Output: JSON with triage decision
```

**Entry Point**:
```bash
node index.js --issue "Users can't log in on mobile"
```

**Output**:
```json
{
  "severity": "critical",
  "component": "auth",
  "confidence": 92,
  "suggested_team": "backend",
  "context": "Mobile login flow broken, affects all mobile users."
}
```

**System Prompt (Classifier)**:
```
You are an issue classifier. Analyze the GitHub issue and assign:
- Severity: critical (system down), high (major feature broken), medium (workaround exists), low (polish/docs)
- Component: auth, api, ui, database, infra, or docs
- Confidence: 0-100

Output ONLY JSON: { severity, component, confidence }
```

**Files**:
```
05-bug-triage/
├── package.json
├── .env.example
├── README.md
├── index.js (2-agent DAG)
├── src/core/ (copy)
├── src/agents/
│   ├── ClassifierAgent.js
│   └── RouterAgent.js
└── memory/reality/bug-triage.yaml
```

**Key Pattern**: Pattern 05 (RAG) + structured output validation.

---

## Shared Core Files (Copy to All 5 Systems)

All systems need these in `src/core/`:

### Blackboard.js
```javascript
class Blackboard {
  constructor(goal)
  appendNote(agentName, content)
  setArtifact(key, value)
  recordCost(provider, usd, tokensIn, tokensOut)
  summary() → { total_cost, notes_count, artifacts_count }
}

class BudgetExceededError extends Error {}
```

### BaseAgent.js
```javascript
class BaseAgent {
  async execute(goal, context, blackboard)
  async _callProvider(goal, context, blackboard)  // multi-provider routing
  systemPrompt()  // override in subclass
  _getCacheKey(goal, context) → SHA-256
  static cleanJSON(raw)  // safe JSON parsing
}
```

**No DAGRunner needed for 01, 04**. Systems 02, 03, 05 need it (copy from agentic-patterns/starter-node).

---

## Reality Files (For All 5)

Each system's `memory/reality/` should document:

```yaml
working:
  - claim: "Agent produces expected output format"
    confidence: 95
    verify: "Run command X, check output matches schema Y"

  - claim: "Response caching works (skips duplicate LLM calls)"
    confidence: 90
    verify: "Run twice with same input, check 'Cache hit' log"

  - claim: "Budget guard stops execution if exceeded"
    confidence: 95
    verify: "Set BUDGET_USD=0.01, run, confirm error"

stubs:
  - "Feature not yet implemented"

not_wired:
  - "Design decision not to implement"
```

---

## Summary

| System | Agents | DAG? | Core Pattern | Files |
|--------|--------|------|--------------|-------|
| 01 | 1 | No | Pattern 02 + 05 | 10 |
| 02 | 2 | Yes | Pattern 01 + 04 | 12 |
| 03 | 3 | Yes | Pattern 01 | 13 |
| 04 | 1 | No | Pattern 05 | 10 |
| 05 | 2 | Yes | Pattern 05 | 12 |

**Total files**: ~57 files across 5 systems (many are copies of core modules).

---

## Build Order

1. ✅ **01 — Research Agent** (simplest, single agent, done)
2. **02 — Code Reviewer** (introduces DAG, 2 agents)
3. **04 — Test Case Generator** (single agent, pattern practice)
4. **03 — Blog Post Generator** (3-agent DAG, most complex)
5. **05 — Bug Triage** (2-agent DAG, real-world scenario)

---

## Next: Push All to GitHub

After building all 5:

```bash
cd agentic-systems/
git init
git add .
git commit -m "Add 5 clonable agent systems with docs"
git remote add origin https://github.com/shubham0086/agentic-systems
git push -u origin main
```

Then update agentic-patterns README to link to agentic-systems.

---

## Notes

- All systems default to **Ollama** (free, local, no API key)
- Use **.env.example** as template, users copy to .env and add their own keys
- Keep agents **<500 lines** each (readable, modifiable)
- Each system has **working README** with customization guide
- Each system has **reality file** documenting what it claims + how to verify
