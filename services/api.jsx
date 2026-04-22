// services/api.js

const API_URL = 'https://helloapi-five.vercel.app';

export const api = {
  // Start session with user preferences (not a generated prompt)
  startSession: async (language, userId, topicId, topicName, topicConcept, topicExample, userPreferences) => {
    try {
      const response = await fetch(`${API_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language, 
          userId,
          topicId,
          topicName,
          topicConcept,
          topicExample,
          userPreferences  // Send raw preferences, not a prompt
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Start session error:', error);
      return { 
        message: `👋 Hello! I'm your ${language} tutor. Let's learn ${language} together! What would you like to practice?`
      };
    }
  },

  // Send message - no system prompt needed (server stores it)
  sendMessage: async (sessionId, message, language, topic, conversationHistory) => {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message,
          language,
          topic: { id: topic.id, name: topic.name, concept: topic.concept },
          conversationHistory
          // No systemPrompt here - server uses stored one
        })
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Send message error:', error);
      return "I'm having connection issues. Could you please repeat that?";
    }
  },

  endSession: async (sessionId) => {
    try {
      await fetch(`${API_URL}/api/session/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch (error) {
      console.error('End session error:', error);
    }
  },

  fetchStats: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/stats/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch stats error:', error);
      return null;
    }
  }
};