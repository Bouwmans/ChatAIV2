import { a } from '@aws-amplify/backend';

export const schema = a.schema({
  Conversation: a
    .model({
      title: a.string().required(),
      summary: a.string(),
      messages: a.hasMany('Message', 'conversationId'),
      createdAt: a.string().required(),
      updatedAt: a.string().required(),
    })
    .authorization((allow) => [allow.owner()]),
  Message: a
    .model({
      conversationId: a.id().required(),
      role: a.string().required(),
      content: a.string().required(),
      createdAt: a.string().required(),
      conversation: a.belongsTo('Conversation', 'conversationId'),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = typeof schema;
