// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { chatBedrock } from '../functions/chatbedrock/resource';

/**
 * Minimal schema: Mutation to chat via Lambda.
 * - Auth: Applied at the mutation level for custom ops.
 * - Handler: Binds to function.
 */
const schema = a.schema({
  // Add a minimal query to satisfy GraphQL requirements
  ping: a
    .query()
    .returns(a.string())
    .handler(a.handler.custom({ entry: './ping.js' })) // Or bind to a real handler if needed
    .authorization((allow) => [allow.authenticated()]),

  chat: a
    .mutation()
    .arguments({ message: a.string().required() })
    .returns(a.string())
    .handler(a.handler.function(chatBedrock))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});