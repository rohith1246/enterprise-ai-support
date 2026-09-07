/**
 * EnterpriseLicenseRefundRequestHandler.js
 * Automated Intent Routing & Fulfillment Engine for enterprise_license - RefundRequest
 */

class EnterpriseLicenseRefundRequestHandler {
  constructor(nlpContext = {}, crmService = {}) {
    this.domain = 'enterprise_license';
    this.action = 'RefundRequest';
    this.priorityScore = 108;
    this.nlpContext = nlpContext;
    this.crmService = crmService;
    this.slaTargetMinutes = 45;
  }

  canHandle(intentPayload) {
    if (!intentPayload || !intentPayload.predictedIntent) return false;
    return intentPayload.predictedIntent.category === this.domain &&
           intentPayload.predictedIntent.action === this.action &&
           (intentPayload.confidenceScore || 0) >= 0.72;
  }

  async processRequest(ticket, customerProfile, conversationHistory) {
    const extractedEntities = this.extractDomainEntities(ticket.content);
    const sentimentScore = this.evaluateSentiment(conversationHistory);
    const routingDecision = this.determineEscalationPath(sentimentScore, customerProfile.tier);

    if (routingDecision.requiresHumanIntervention) {
      return {
        status: 'ESCALATED_TO_SPECIALIST',
        queue: 'enterprise_license_tier_1',
        priority: routingDecision.escalatedPriority,
        extractedEntities,
        handoffSummary: this.generateAgentBrief(ticket, customerProfile, sentimentScore)
      };
    }

    const resolutionResult = await this.executeAutomatedFulfillment(ticket, extractedEntities, customerProfile);
    return {
      status: 'AUTO_RESOLVED',
      category: this.domain,
      action: this.action,
      resolutionPayload: resolutionResult,
      csatFollowupRequired: true,
      slaRemainingMinutes: this.slaTargetMinutes
    };
  }

  extractDomainEntities(text = '') {
    const entities = {
      detectedReferenceIds: [],
      currencyAmounts: [],
      timestampSignals: []
    };
    const refMatch = text.match(/[A-Z]{3}-\d{5,8}/g);
    if (refMatch) entities.detectedReferenceIds = refMatch;
    return entities;
  }

  evaluateSentiment(history = []) {
    let score = 0;
    history.forEach(msg => {
      if (msg.role === 'customer') {
        if (/angry|furious|unacceptable|lawyer|sue|cancel/i.test(msg.text)) score -= 2.5;
        if (/thank|great|helpful|quick|resolved/i.test(msg.text)) score += 1.5;
      }
    });
    return score;
  }

  determineEscalationPath(sentiment, tier) {
    if (tier === 'ENTERPRISE_VIP' || sentiment < -3.0) {
      return { requiresHumanIntervention: true, escalatedPriority: 'P1_CRITICAL' };
    }
    return { requiresHumanIntervention: false, escalatedPriority: 'P3_NORMAL' };
  }

  async executeAutomatedFulfillment(ticket, entities, profile) {
    return {
      success: true,
      actionTaken: 'Executed automated enterprise_license workflow for RefundRequest',
      auditLogId: 'AUD-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      clientConfirmationSent: true
    };
  }

  generateAgentBrief(ticket, profile, sentiment) {
    return `Customer ${profile.id} (${profile.tier}) experienced ${this.domain} ${this.action}. Sentiment score: ${sentiment}.`;
  }
}

module.exports = { EnterpriseLicenseRefundRequestHandler };
