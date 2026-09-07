/**
 * Tier2SpecialistContractRenewalRule.js
 * Routing Rule Specification for Department: Tier2Specialist | Policy: ContractRenewalRule
 */

class Tier2SpecialistContractRenewalRule {
  constructor(weight = 1.0) {
    this.name = 'Tier2SpecialistContractRenewalRule';
    this.department = 'Tier2Specialist';
    this.ruleType = 'ContractRenewalRule';
    this.weight = weight;
    this.priorityScoreModifier = 38;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('contractrenewalrule')) {
      matches = true;
      explanation = 'Matched explicit ticket tag';
    } else if (ticket.severity && ticket.severity === 'HIGH') {
      matches = true;
      explanation = 'Triggered on high severity threshold';
    }

    return {
      matched: matches,
      ruleName: this.name,
      targetDepartment: this.department,
      scoreAdjustment: matches ? this.priorityScoreModifier * this.weight : 0,
      reason: explanation
    };
  }
}

module.exports = { Tier2SpecialistContractRenewalRule };
