/**
 * Tier2SpecialistDataLossRule.js
 * Routing Rule Specification for Department: Tier2Specialist | Policy: DataLossRule
 */

class Tier2SpecialistDataLossRule {
  constructor(weight = 1.0) {
    this.name = 'Tier2SpecialistDataLossRule';
    this.department = 'Tier2Specialist';
    this.ruleType = 'DataLossRule';
    this.weight = weight;
    this.priorityScoreModifier = 24;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('datalossrule')) {
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

module.exports = { Tier2SpecialistDataLossRule };
