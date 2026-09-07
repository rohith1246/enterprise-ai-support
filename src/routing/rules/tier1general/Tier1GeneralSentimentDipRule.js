/**
 * Tier1GeneralSentimentDipRule.js
 * Routing Rule Specification for Department: Tier1General | Policy: SentimentDipRule
 */

class Tier1GeneralSentimentDipRule {
  constructor(weight = 1.0) {
    this.name = 'Tier1GeneralSentimentDipRule';
    this.department = 'Tier1General';
    this.ruleType = 'SentimentDipRule';
    this.weight = weight;
    this.priorityScoreModifier = 36;
  }

  evaluate(ticketContext) {
    const { ticket, customer, metadata } = ticketContext;
    if (!ticket) return { matched: false, score: 0 };

    let matches = false;
    let explanation = '';

    if (ticket.tags && ticket.tags.includes('sentimentdiprule')) {
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

module.exports = { Tier1GeneralSentimentDipRule };
