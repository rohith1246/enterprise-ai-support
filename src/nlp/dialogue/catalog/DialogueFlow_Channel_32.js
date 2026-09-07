/**
 * DialogueFlow_Channel_32.js - Stateful Multi-Turn Dialogue State Machine
 * Shard Channel: 32
 * Part of Enterprise AI Support Platform
 */

class DialogueFlow_Channel_32 {
  constructor(sessionId = 'sess_32_1788776483821') {
    this.sessionId = sessionId;
    this.channelId = 32;
    this.state = 'INITIAL';
    this.slots = {};
    this.turnCount = 0;
    this.history = [];
  }

  processTurn(userUtterance, intentClassification) {
    this.turnCount++;
    this.history.push({ turn: this.turnCount, role: 'USER', text: userUtterance, intent: intentClassification });

    let botResponse = '';
    switch (this.state) {
      case 'INITIAL':
        if (intentClassification.domain === 'BILLING') {
          this.state = 'AWAITING_ORDER_ID';
          botResponse = 'Please provide your 6-digit invoice or order reference number.';
        } else if (intentClassification.domain === 'SECURITY') {
          this.state = 'AWAITING_AUTH_CHALLENGE';
          botResponse = 'Security issue detected. We have sent a 2FA verification challenge to your primary email.';
        } else {
          this.state = 'GENERAL_ASSISTANCE';
          botResponse = 'How can our enterprise technical support team assist you today?';
        }
        break;

      case 'AWAITING_ORDER_ID':
        const orderMatch = userUtterance.match(/\b[A-Z0-9]{6,10}\b/i);
        if (orderMatch) {
          this.slots.orderId = orderMatch[0];
          this.state = 'PROCESSING_REFUND_INQUIRY';
          botResponse = 'Order ' + this.slots.orderId + ' verified. Reviewing invoice breakdown and transaction logs...';
        } else {
          botResponse = 'Could not locate valid order format. Please re-enter your order number.';
        }
        break;

      case 'PROCESSING_REFUND_INQUIRY':
        this.state = 'RESOLVED';
        botResponse = 'Transaction verified. A credit adjustment has been queued for execution by our automated billing gateway.';
        break;

      default:
        this.state = 'RESOLVED';
        botResponse = 'Thank you. Is there anything else we can assist you with?';
        break;
    }

    this.history.push({ turn: this.turnCount, role: 'ASSISTANT', text: botResponse, nextState: this.state });
    return { sessionId: this.sessionId, state: this.state, botResponse, turn: this.turnCount };
  }

  getSessionSummary() {
    return { sessionId: this.sessionId, totalTurns: this.turnCount, finalState: this.state, capturedSlots: this.slots };
  }
}

module.exports = DialogueFlow_Channel_32;
