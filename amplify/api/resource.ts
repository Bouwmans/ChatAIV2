import { defineApi } from '@aws-amplify/backend';
import { chat } from '../functions/chat/resource';

export const chatApi = defineApi({
  name: 'chatApi',
  routes: [
    {
      path: '/chat',
      method: 'POST',
      function: chat,
    },
  ],
  authorizationType: 'userPool',
});
