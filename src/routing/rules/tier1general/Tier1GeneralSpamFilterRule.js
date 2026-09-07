/**
 * Tier1GeneralSpamFilterRule.js
 * Routing Rule Specification for Department: Tier1General | Policy: SpamFilterRule
 */

class Tier1GeneralSpamFilterRule {
  constructor(weight = 1.0) {
    this.name = 'Tier1GeneralSpamFilterRule';
    this.department = 'Tier1General';
    this.ruleType = 'SpamFilterRule';
    this.weight = weight;
    this.priorityScoreModifier = 32;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('spamfilterrule')) {
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

module.exports = { Tier1GeneralSpamFilterRule };
