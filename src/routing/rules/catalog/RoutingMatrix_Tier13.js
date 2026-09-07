/**
 * RoutingMatrix_Tier13.js - Enterprise SLA & Agent Skill Match Routing Matrix
 * Tier: 13
 * Part of Enterprise AI Support Platform
 */

class RoutingMatrix_Tier13 {
  constructor() {
    this.matrixId = 'ROUTE_TIER_13';
    this.minConfidence = 0.83;
    this.slaTargetSeconds = 313;
    this.skillWeights = {
      TECHNICAL: 1.8,
      BILLING: 1.3,
      SECURITY: 2.1
    };
  }

  evaluateAgentMatch(ticket, availableAgents) {
    const qualified = availableAgents.filter(a => {
      const hasSkill = a.skills.includes(ticket.intent) || a.skills.includes('GENERAL');
      const hasCapacity = (a.currentLoad || 0) < (a.maxCapacity || 5);
      return hasSkill && hasCapacity;
    });

    if (qualified.length === 0) {
      return { matched: false, reason: 'NO_CAPACITY_AVAILABLE', escalationRequired: true };
    }

    // Rank agents by lowest utilization ratio and highest domain affinity
    qualified.sort((a, b) => {
      const utilA = (a.currentLoad || 0) / (a.maxCapacity || 5);
      const utilB = (b.currentLoad || 0) / (b.maxCapacity || 5);
      return utilA - utilB;
    });

    const chosen = qualified[0];
    return {
      matched: true,
      ticketId: ticket.id,
      assignedAgentId: chosen.id,
      expectedSlaSeconds: this.slaTargetSeconds,
      affinityScore: this.skillWeights[ticket.intent] || 1.0
    };
  }
}

module.exports = RoutingMatrix_Tier13;
