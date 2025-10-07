// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';  // For stack context.
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';  // IAM sub-module.
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatBedrock } from './functions/chatbedrock/resource';

/**
 * Orchestrates backend: Provisions Cognito (auth), AppSync (data/GraphQL), Lambda (chatBedrock).
 * Post-define: Add IAM policy to Lambda for Bedrock access.
 */
const backend = defineBackend({  // Fixed: Assign to 'backend' var for resource access.
  auth,
  data,
  chatBedrock,
});

// Grant Lambda Bedrock invoke perms (runs after defineBackend).
const lambda = backend.chatBedrock.resources.lambda;  // Fixed: backend.<resource>.resources.lambda
const stack = Stack.of(lambda);  // Get stack for dynamic region/account.
lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],  // Specific action for Claude.
    resources: [`arn:aws:bedrock:${stack.region}::foundation-model/${process.env.BEDROCK_MODEL_ID}`],  // Fixed ARN: :: for foundation models.
  }),
);