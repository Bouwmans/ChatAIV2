import { defineFunction } from '@aws-amplify/backend';

export const bedrockChat = defineFunction({
  name: 'bedrock-chat',
  entry: './bedrock-chat/handler.ts',
  environment: {
    BEDROCK_MODEL_ID: 'anthropic.claude-3-sonnet-20240229-v1:0',
  },
});
