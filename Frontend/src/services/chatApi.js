import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with interceptors for auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travelcooker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Chat API service
export const chatApi = {
  // Get all chat sessions for the current user
  getSessions: async () => {
    try {
      const response = await api.get('/chat/sessions');
      return response.data.sessions;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  },

  // Get all chat sessions for the current user (alias for compatibility)
  getChatSessions: async () => {
    return chatApi.getSessions();
  },

  // Get a specific chat session with all messages
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}`);
      return response.data.session;
    } catch (error) {
      console.error('Error fetching chat session:', error);
      throw error;
    }
  },

  // Get a specific chat session with all messages (alias for compatibility)
  getChatSession: async (sessionId) => {
    return chatApi.getSession(sessionId);
  },

  // Create a new chat session
  createSession: async (data = {}) => {
    try {
      const response = await api.post('/chat/sessions', {
        title: data.title || `New Chat - ${new Date().toLocaleDateString()}`
      });
      return response.data.session;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },

  // Create a new chat session (alias for compatibility)
  createChatSession: async (title = null) => {
    return chatApi.createSession({ title });
  },

  // Add a message to a chat session
  addMessage: async (sessionId, content, sender = 'user') => {
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, {
        content,
        sender
      });
      return response.data.data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Update chat session title
  updateChatTitle: async (sessionId, title) => {
    try {
      await api.patch(`/chat/sessions/${sessionId}`, { title });
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  },

  // Delete a chat session
  deleteSession: async (sessionId) => {
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  },

  // Delete a chat session (alias for compatibility)
  deleteChatSession: async (sessionId) => {
    return chatApi.deleteSession(sessionId);
  },

  // Create travel plan using AI (public endpoint)
  createTravelPlan: async (planData) => {
    try {
      const response = await api.post('/chat/public/travel-plan', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating travel plan:', error);
      throw error;
    }
  }
};

export { api }; 