'use strict';
const fs = require('fs');
const path = require('path');
const { Guardrails } = require('./Guardrails');

/**
 * Observability — execution tracing and telemetry logging for agentic runs.
 * Redacts secrets automatically and writes local execution logs to runs/.
 */
class Observability {
  constructor(goal) {
    this.goal = goal;
    this.runId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    this.startTime = Date.now();
    this.steps = [];
    this.llmCalls = [];
    this.totalCost = 0;
  }

  logAgentStart(agentName, input) {
    this.steps.push({
      agent: agentName,
      event: 'start',
      timestamp: new Date().toISOString(),
      input: Guardrails.sanitizeOutput(input)
    });
  }

  logAgentEnd(agentName, output, latencyMs, cost) {
    this.totalCost += cost;
    this.steps.push({
      agent: agentName,
      event: 'end',
      timestamp: new Date().toISOString(),
      latency_ms: latencyMs,
      cost_usd: cost,
      output: Guardrails.sanitizeOutput(output)
    });
  }

  logLLMCall(agentName, provider, model, durationMs, cost) {
    this.llmCalls.push({
      agent: agentName,
      provider,
      model,
      duration_ms: durationMs,
      cost_usd: cost,
      timestamp: new Date().toISOString()
    });
  }

  saveTrace() {
    const trace = {
      run_id: this.runId,
      goal: this.goal,
      time_elapsed_ms: Date.now() - this.startTime,
      total_cost_usd: this.totalCost,
      steps: this.steps,
      llm_calls: this.llmCalls,
    };

    const dir = path.join(process.cwd(), 'runs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `trace-${this.runId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(trace, null, 2), 'utf-8');
    console.log(`  [Observability] Trace written to: ${filePath}`);
    return filePath;
  }
}

module.exports = { Observability };
