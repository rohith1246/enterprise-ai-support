/**
 * Tier2SpecialistPartnerEscalationRule.js
 * Routing Rule Specification for Department: Tier2Specialist | Policy: PartnerEscalationRule
 */

class Tier2SpecialistPartnerEscalationRule {
  constructor(weight = 1.0) {
    this.name = 'Tier2SpecialistPartnerEscalationRule';
    this.department = 'Tier2Specialist';
    this.ruleType = 'PartnerEscalationRule';
    this.weight = weight;
    this.priorityScoreModifier = 58;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('partnerescalationrule')) {
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

module.exports = { Tier2SpecialistPartnerEscalationRule };
