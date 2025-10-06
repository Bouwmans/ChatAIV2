import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chatApi } from './api/resource';

defineBackend({
  auth,
  data,
  chatApi,
});
