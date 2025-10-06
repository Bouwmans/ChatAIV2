import { defineFunction } from '@aws-amplify/backend';

export const chat = defineFunction({
  name: 'bedrockChatHandler',
  entry: './handler.ts',
  runtime: 'nodejs18.x',
  timeoutSeconds: 60,
  memoryMB: 1024,
  environment: {
    BEDROCK_MODEL_ID: 'anthropic.claude-3-sonnet-20240229-v1:0',
  },
});

chat.addEnvironment('BEDROCK_REGION', process.env.AWS_REGION ?? 'us-east-1');

chat.addToRolePolicy({
  Effect: 'Allow',
  Action: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
  Resource: '*',
});
