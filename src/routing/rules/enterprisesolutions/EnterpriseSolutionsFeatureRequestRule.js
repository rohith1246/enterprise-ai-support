/**
 * EnterpriseSolutionsFeatureRequestRule.js
 * Routing Rule Specification for Department: EnterpriseSolutions | Policy: FeatureRequestRule
 */

class EnterpriseSolutionsFeatureRequestRule {
  constructor(weight = 1.0) {
    this.name = 'EnterpriseSolutionsFeatureRequestRule';
    this.department = 'EnterpriseSolutions';
    this.ruleType = 'FeatureRequestRule';
    this.weight = weight;
    this.priorityScoreModifier = 60;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('featurerequestrule')) {
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

module.exports = { EnterpriseSolutionsFeatureRequestRule };
