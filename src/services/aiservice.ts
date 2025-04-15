import api from './api';

interface AIChatRequest {
  message: string;
  options?: {
    smartMode?: 'create' | 'edit';
  }
}

interface AIChatResponse {
  success: boolean;
  response: string;
  actionData?: {
    action: string;
    success: boolean;
    product?: any;
  };
}

export const sendAdminChatMessage = async (
  message: string, 
  options?: { smartMode?: 'create' | 'edit' }
): Promise<AIChatResponse> => {
  const response = await api.post('/aiservice/chat', { 
    message,
    options
  });
  return response.data;
};