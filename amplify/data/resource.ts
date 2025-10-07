// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { chatBedrock } from '../functions/chatbedrock/resource';  // Link function.

/**
 * Minimal schema: Mutation to chat via Lambda.
 * - Auth: Only logged-in users (field-level on mutation—ties to Cognito).
 * - Handler: Binds to our function (auto-passes args like { message }).
 * Later: Add models for chat history.
 */
const schema = a.schema({
  chat: a
    .mutation()
    .arguments({ message: a.string().required() })
    .returns(a.string())  // Returns reply string.
    .authorization((allow) => [allow.authenticated()])  // Field-level: Signed-in users only.
    .handler(a.handler.function(chatBedrock)),
});
// Fixed: Removed global .authorization((allow) => [allow.authenticated()])—avoids duplicate rules.

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',  // Uses Cognito User Pool (from auth resource).
  },
});