# Research Agent

**Clonable System 01** — Single-agent system that researches any topic and outputs a structured markdown summary.

## What It Does

```
Input: "multi-agent AI systems"
  ↓
Agent: Researches the topic deeply
  ↓
Output: research-multi-agent-ai-systems.md (structured, with sources)
```

## Quick Start

```bash
npm install
cp .env.example .env
node index.js --topic "your topic here"
```

**Output**: `research-<topic>.md` in current directory.

## Examples

```bash
# Default topic (machine learning in 2026)
node index.js

# Custom topic
node index.js --topic "quantum computing"

# Custom topic + output file
node index.js --topic "climate change" --output climate-research.md
```

## How to Customize

### 1. Change the Research Depth

In `.env`:
```bash
# "quick" = ~500 words, 2-minute research
# "thorough" = ~1500 words, 5-minute research (default)
RESEARCH_DEPTH=quick
```

### 2. Change the System Prompt

Edit `src/agents/ResearcherAgent.js`, update `systemPrompt()`:

```javascript
systemPrompt() {
  return `You are a [YOUR ROLE]. Research the topic...`;
}
```

Examples:
- "You are a policy analyst. Research..." → Policy papers
- "You are a technical architect. Research..." → Tech-focused summaries
- "You are a science journalist. Research..." → Accessible explanations

### 3. Change Output Format

Edit `_formatOutput()` in `ResearcherAgent.js` to customize markdown structure.

### 4. Add a Provider

In `src/core/BaseAgent.js`, implement your provider:

```javascript
async _callYourProvider(goal, context) {
  // Call your API
  const response = await fetch('https://your-api.com/...');
  return { output, cost, tokens_in, tokens_out, provider: 'your-provider' };
}
```

Then add to `.env`:
```bash
PROVIDER_ORDER=your-provider,ollama
YOUR_PROVIDER_API_KEY=sk-...
```

## How It Works

### 1. Ollama (Default, Free)

Runs local language models. No API keys needed.

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2:7b

# Confirm it works
ollama run llama2:7b "say hello"

# Run research agent
node index.js --topic "test"
```

### 2. Caching

Same topic → cached response (no LLM call, instant).

```bash
node index.js --topic "AI"     # 20s, LLM call
node index.js --topic "AI"     # 0.1s, cached
```

### 3. Budget Guard

Costs tracked per LLM provider. Stops if budget exceeded.

```bash
# .env
BUDGET_USD=5.00
```

If total cost > $5, execution stops with `BudgetExceededError`.

## Patterns Demonstrated

- **Pattern 02**: Multi-provider LLM routing (Ollama → OpenAI → etc)
- **Pattern 05**: Response caching (SHA-256 keyed, prevents re-compute)

## Extending

### Add search capability

```javascript
async search(query) {
  // Use DuckDuckGo or similar
  const results = await fetch(`https://api.duckduckgo.com/?q=${query}&format=json`);
  return results;
}
```

Then modify the agent to include search results in context.

### Add source verification

Add a second agent to verify citations:

```javascript
// Verify each claim in the research output
const citations = extractCitations(output);
const verified = await VerifierAgent.verifyCitations(citations);
```

### Add multi-section research

Have the agent break down the topic into sections and research each independently.

## Observability

Check `memory/reality/research.yaml` for what the system claims to do and how to verify it.

## Cost Estimate

- **Ollama**: Free (runs locally)
- **OpenAI GPT-4**: ~$0.10 per research
- **Claude 3 Haiku**: ~$0.05 per research
- **Gemini**: ~$0.01 per research (free tier available)

## Troubleshooting

**"Cannot find module 'dotenv'"**
```bash
npm install
```

**"Ollama is not responding"**
```bash
ollama serve    # Start Ollama server
ollama list     # Check models installed
```

**"All providers failed"**
- Check `.env` has correct API keys
- Confirm Ollama is running on localhost:11434
- Check `LOG_LEVEL=debug` for detailed errors

**"Budget exceeded"**
- Increase `BUDGET_USD` in `.env`
- Or use a cheaper provider (Ollama is free)

## Next Steps

1. ✅ Customize the system prompt for your domain
2. ✅ Test with Ollama (free, local)
3. ✅ Add your own provider key for better models
4. ✅ Integrate into your pipeline (call from another app)
5. ✅ Add verification or fact-checking agent

## See Also

- [Pattern 02 — Multi-Provider LLM Routing](../../agentic-patterns/docs/02-multi-provider-llm-routing.md)
- [Pattern 05 — RAG That Doesn't Suck](../../agentic-patterns/docs/05-rag-that-doesnt-suck.md)
- [agentic-patterns README](../../agentic-patterns/README.md)
