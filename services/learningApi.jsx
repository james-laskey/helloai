 // services/learningApi.js

import { api } from './api';

const LEARNING_API_URL = process.env.LEARNING_API_URL || 'https://helloapi-five.vercel.app/api/learning';

export const learningApi = {
  generateFlashcards: async (data) => {
    const response = await fetch(`${LEARNING_API_URL}/generate-flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  generateQuiz: async (data) => {
    const response = await fetch(`${LEARNING_API_URL}/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  submitQuiz: async (data) => {
    const response = await fetch(`${LEARNING_API_URL}/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  updateFlashcardMastery: async (data) => {
    const response = await fetch(`${LEARNING_API_URL}/update-flashcard-mastery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};