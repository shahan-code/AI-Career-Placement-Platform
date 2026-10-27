import { tokenStorage } from './api';

export const aiService = {
  /**
   * Check backend AI service status
   */
  async getStatus() {
    try {
      const res = await fetch('/api/ai/status');
      const data = await res.json();
      return data.data;
    } catch (err) {
      return { configured: false, mode: 'offline', error: err.message };
    }
  },

  /**
   * Send multi-turn chat message
   */
  async sendChatMessage(message, conversationHistory = []) {
    const token = tokenStorage.get();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        conversationHistory
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to get AI response');
    }
    return {
      reply: data.data.reply,
      isLive: data.data.isLive,
      model: data.data.model,
      toString() { return this.reply; }
    };
  }
};
