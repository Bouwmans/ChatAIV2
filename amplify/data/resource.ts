import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { chatBedrock } from '../functions/chatbedrock/resource';

const schema = a.schema({
  // Dummy model to provide root Query type (can be ignored in your app)
  Todo: a.model({
    content: a.string()
  }).authorization((allow) => [allow.authenticated()]), // Match auth to your mutation

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