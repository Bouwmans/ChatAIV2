import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data';
import type { Conversation, Message, ChatRequest, ChatResponse } from '../types';

const client = generateClient<Schema>();

export class ConversationService {
  static async getConversations(): Promise<Conversation[]> {
    try {
      const { data } = await client.models.Conversation.list({
        limit: 50,
        sortDirection: 'DESC',
      });
      return data as Conversation[];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  static async createConversation(title: string): Promise<Conversation> {
    try {
      const { data } = await client.models.Conversation.create({
        title,
        userId: 'current-user', // This will be replaced by the actual user ID from auth
      });
      return data as Conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  static async updateConversation(id: string, title: string): Promise<Conversation> {
    try {
      const { data } = await client.models.Conversation.update({
        id,
        title,
      });
      return data as Conversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  static async deleteConversation(id: string): Promise<void> {
    try {
      await client.models.Conversation.delete({ id });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}

export class MessageService {
  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data } = await client.models.Message.list({
        filter: { conversationId: { eq: conversationId } },
        sortDirection: 'ASC',
      });
      return data as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async createMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message> {
    try {
      const { data } = await client.models.Message.create({
        conversationId,
        role,
        content,
        timestamp: new Date().toISOString(),
      });
      return data as Message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  static async deleteMessage(id: string): Promise<void> {
    try {
      await client.models.Message.delete({ id });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export class ChatService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // In a real implementation, you would call the Lambda function via API Gateway
      // For now, we'll simulate a response
      const response = await fetch('/api/bedrock-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to Bedrock:', error);
      // Return a mock response for development
      return {
        response: "I'm Claude, an AI assistant. I'm here to help you with any questions or tasks you might have. How can I assist you today?",
        usage: {
          inputTokens: 10,
          outputTokens: 25,
        },
      };
    }
  }
}
