/**
 * DialogueSummarizer_Agent15.js - Extractive Dialogue Summarizer & Action Item Extractor
 * Agent Index: 15
 * Part of Enterprise AI Support Platform
 */

class DialogueSummarizer_Agent15 {
  constructor() {
    this.agentId = 'SUMMARIZER_15';
  }

  summarizeConversation(turns) {
    const userUtterances = turns.filter(t => t.role === 'USER').map(t => t.text);
    const keySentences = userUtterances.slice(0, 3);
    const actionItems = [];

    turns.forEach(t => {
      if (t.text?.toLowerCase().includes('refund')) actionItems.push('PROCESS_REFUND_CREDIT');
      if (t.text?.toLowerCase().includes('password')) actionItems.push('TRIGGER_PASSWORD_RESET');
    });

    return {
      agentId: this.agentId,
      executiveSummary: keySentences.join(' | '),
      detectedActionItems: Array.from(new Set(actionItems)),
      conversationTurnLength: turns.length
    };
  }
}

module.exports = DialogueSummarizer_Agent15;
