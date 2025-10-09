// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import * as iam from 'aws-cdk-lib/aws-iam';  // Fixed: Import * as iam (matches docs for PolicyStatement).
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatBedrock } from './functions/chatbedrock/resource';

/**
 * Orchestrates backend: Auth, data, functions (no hosting here—use Console for Vite).
 * Post-define: Add IAM policy to Lambda for Bedrock access (exact docs syntax).
 */
const backend = defineBackend({
  auth,
  data,
  // chatBedrock,
  // Removed: Hosting config not supported for Vite SPA in defineBackend.
}, {
  region: 'eu-west-1'
});

// // Grant Lambda Bedrock invoke perms (docs-exact: backend.<function>.resources.lambda).
// const lambda = backend.chatBedrock.resources.lambda;
// const statement = new iam.PolicyStatement({
//   effect: iam.Effect.ALLOW,
//   actions: ['bedrock:InvokeModel'],
//   resources: [`arn:aws:bedrock:${lambda.stack.region}::foundation-model/${process.env.BEDROCK_MODEL_ID}`],  // Dynamic region from stack.
// });
// lambda.addToRolePolicy(statement);