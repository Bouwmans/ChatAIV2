export type Conversation = {
  id: string;
  title: string;
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};

export type Schema = {
  Conversation: {
    id: string;
    type: Conversation;
    operations: {
      read: Conversation;
    };
  };
  Message: {
    id: string;
    type: Message;
    operations: {
      read: Message;
    };
  };
};
