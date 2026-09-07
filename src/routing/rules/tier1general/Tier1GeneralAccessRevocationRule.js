/**
 * Tier1GeneralAccessRevocationRule.js
 * Routing Rule Specification for Department: Tier1General | Policy: AccessRevocationRule
 */

class Tier1GeneralAccessRevocationRule {
  constructor(weight = 1.0) {
    this.name = 'Tier1GeneralAccessRevocationRule';
    this.department = 'Tier1General';
    this.ruleType = 'AccessRevocationRule';
    this.weight = weight;
    this.priorityScoreModifier = 26;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('accessrevocationrule')) {
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

module.exports = { Tier1GeneralAccessRevocationRule };
