/**
 * EnterpriseSolutionsAccessRevocationRule.js
 * Routing Rule Specification for Department: EnterpriseSolutions | Policy: AccessRevocationRule
 */

class EnterpriseSolutionsAccessRevocationRule {
  constructor(weight = 1.0) {
    this.name = 'EnterpriseSolutionsAccessRevocationRule';
    this.department = 'EnterpriseSolutions';
    this.ruleType = 'AccessRevocationRule';
    this.weight = weight;
    this.priorityScoreModifier = 66;
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

module.exports = { EnterpriseSolutionsAccessRevocationRule };
