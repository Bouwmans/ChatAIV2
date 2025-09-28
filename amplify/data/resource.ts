import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Conversation: a
    .model({
      id: a.id().required(),
      title: a.string().required(),
      userId: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
      messages: a.hasMany('Message', 'conversationId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
    ]),

  Message: a
    .model({
      id: a.id().required(),
      conversationId: a.id().required(),
      role: a.enum(['user', 'assistant']),
      content: a.string().required(),
      timestamp: a.datetime().required(),
      conversation: a.belongsTo('Conversation', 'conversationId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
