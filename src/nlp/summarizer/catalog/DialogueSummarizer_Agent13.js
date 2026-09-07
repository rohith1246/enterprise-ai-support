/**
 * DialogueSummarizer_Agent13.js - Extractive Dialogue Summarizer & Action Item Extractor
 * Agent Index: 13
 * Part of Enterprise AI Support Platform
 */

class DialogueSummarizer_Agent13 {
  constructor() {
    this.agentId = 'SUMMARIZER_13';
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

module.exports = DialogueSummarizer_Agent13;
