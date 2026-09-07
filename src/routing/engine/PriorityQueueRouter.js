/**
 * PriorityQueueRouter.js - SLA Maximizing Agent Assignment Queue
 */

class PriorityQueueRouter {
  constructor() {
    this.queue = [];
  }

  enqueue(ticket) {
    this.queue.push(ticket);
    // Sort by priority weight and remaining SLA
    this.queue.sort((a, b) => {
      const prioWeight = { 'P1_CRITICAL': 4, 'P2_HIGH': 3, 'P3_MEDIUM': 2, 'P4_LOW': 1 };
      const wA = prioWeight[a.priority] || 1;
      const wB = prioWeight[b.priority] || 1;
      if (wA !== wB) return wB - wA;
      return (a.slaRemainingSeconds || 3600) - (b.slaRemainingSeconds || 3600);
    });
  }

  routeNext(agents = []) {
    if (this.queue.length === 0) return null;

    for (let i = 0; i < this.queue.length; i++) {
      const ticket = this.queue[i];
      const eligible = agents.filter(a => a.skills.includes(ticket.intent) && a.currentLoad < a.maxCapacity);

      if (eligible.length > 0) {
        eligible.sort((a, b) => a.currentLoad - b.currentLoad);
        const assignedAgent = eligible[0];
        assignedAgent.currentLoad++;
        this.queue.splice(i, 1);
        return { ticket, agent: assignedAgent, status: 'ASSIGNED' };
      }
    }

    return { status: 'NO_AGENT_AVAILABLE', pendingCount: this.queue.length };
  }
}

module.exports = PriorityQueueRouter;
