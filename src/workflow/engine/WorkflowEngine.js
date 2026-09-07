/**
 * WorkflowEngine.js - Stateful BPMN Support Workflow Orchestration Engine
 * Part of Enterprise AI Support Platform
 */

class WorkflowNode {
  constructor(id, type, handler, transitions = {}) {
    this.id = id;
    this.type = type; // 'TASK', 'DECISION', 'GATEWAY', 'END'
    this.handler = handler; // async (context) => result
    this.transitions = transitions; // { default: 'next_node_id', 'APPROVED': 'node_2', ... }
  }
}

class WorkflowEngine {
  constructor(name = 'SupportAutomationWorkflow') {
    this.name = name;
    this.nodes = new Map();
    this.startNodeId = null;
    this.executionHistory = [];
  }

  setStartNode(id) {
    this.startNodeId = id;
  }

  addNode(id, type, handler, transitions = {}) {
    const node = new WorkflowNode(id, type, handler, transitions);
    this.nodes.set(id, node);
    if (!this.startNodeId) {
      this.startNodeId = id;
    }
    return node;
  }

  async execute(initialContext = {}) {
    if (!this.startNodeId || !this.nodes.has(this.startNodeId)) {
      throw new Error(`Invalid start node: ${this.startNodeId}`);
    }

    const context = { ...initialContext };
    let currentNodeId = this.startNodeId;
    const history = [];

    while (currentNodeId) {
      const node = this.nodes.get(currentNodeId);
      if (!node) break;

      const stepStart = Date.now();
      let stepResult = null;
      let outcome = 'default';

      try {
        if (typeof node.handler === 'function') {
          stepResult = await node.handler(context);
          if (typeof stepResult === 'string') {
            outcome = stepResult;
          } else if (stepResult && stepResult.outcome) {
            outcome = stepResult.outcome;
          }
        }
      } catch (err) {
        history.push({
          nodeId: currentNodeId,
          type: node.type,
          status: 'ERROR',
          error: err.message,
          durationMs: Date.now() - stepStart
        });
        throw err;
      }

      history.push({
        nodeId: currentNodeId,
        type: node.type,
        status: 'COMPLETED',
        outcome,
        result: stepResult,
        durationMs: Date.now() - stepStart
      });

      if (node.type === 'END') {
        break;
      }

      // Determine next node
      const nextNodeId = node.transitions[outcome] || node.transitions['default'] || null;
      currentNodeId = nextNodeId;
    }

    const executionRecord = {
      workflowName: this.name,
      completedAt: Date.now(),
      stepsExecuted: history.length,
      history,
      finalContext: context
    };

    this.executionHistory.push(executionRecord);
    return executionRecord;
  }
}

module.exports = { WorkflowEngine, WorkflowNode };
