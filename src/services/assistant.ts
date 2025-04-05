import api from './api';

export interface AssistantResponse {
  success: boolean;
  response: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Send a message to the AI assistant
export const sendMessage = async (message: string): Promise<AssistantResponse> => {
  try {
    const response = await api.post('/assistant/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw error;
  }
};

// Send a message to the AI assistant (authenticated version)
export const sendPersonalizedMessage = async (message: string): Promise<AssistantResponse> => {
  try {
    const response = await api.post('/assistant/chat/personalized', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending personalized message to assistant:', error);
    throw error;
  }
};