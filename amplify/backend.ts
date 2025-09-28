import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { bedrockChat } from './function/resource';

export const backend = defineBackend({
  auth,
  data,
  bedrockChat,
});

// Grant the Lambda function access to Bedrock
backend.bedrockChat.resources.lambda.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'bedrock:InvokeModel',
    'bedrock:InvokeModelWithResponseStream'
  ],
  Resource: 'arn:aws:bedrock:*:*:model/anthropic.claude-3-sonnet-20240229-v1:0'
});

// Grant the Lambda function access to the GraphQL API
backend.data.resources.cfnResources.cfnGraphqlApi.addPropertyOverride('AdditionalAuthenticationProviders', [
  {
    AuthenticationType: 'AWS_IAM',
    LambdaAuthorizerConfig: {
      AuthorizerUri: backend.bedrockChat.resources.lambda.functionArn,
      AuthorizerResultTtlInSeconds: 300
    }
  }
]);