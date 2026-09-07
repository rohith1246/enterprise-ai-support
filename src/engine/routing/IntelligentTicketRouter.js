/**
 * IntelligentTicketRouter.js - Skills-Based Agent Matching & SLA Priority Queue
 */

class IntelligentTicketRouter {
  constructor(agents = []) {
    this.agents = agents;
  }

  findBestAgent(ticket, agentsList = null) {
    const pool = agentsList || this.agents;
    const { primaryIntent, urgency } = ticket;

    // Filter by department and availability
    const eligible = pool.filter(a => a.status === 'AVAILABLE' && a.currentLoad < a.maxCapacity);
    if (eligible.length === 0) {
      return { assigned: false, queue: 'ESCALATION_OVERFLOW_QUEUE', priorityScore: 99 };
    }

    // Rank by skill match and lowest workload
    eligible.sort((a, b) => {
      const aSkill = a.skills.includes(primaryIntent) ? 2 : 1;
      const bSkill = b.skills.includes(primaryIntent) ? 2 : 1;
      if (aSkill !== bSkill) return bSkill - aSkill;
      return a.currentLoad - b.currentLoad;
    });

    const chosen = eligible[0];
    chosen.currentLoad += 1;
    return {
      assigned: true,
      agentId: chosen.id,
      agentName: chosen.name,
      department: chosen.department,
      estimatedWaitSec: chosen.currentLoad * 45
    };
  }
}

module.exports = IntelligentTicketRouter;
