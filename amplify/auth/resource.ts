// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * Define a simple email/password auth setup.
 * - loginWith.email: Enables username (email) + password.
 * - Defaults: Requires email verification on signup (via code), min 8-char password.
 * Run `npx ampx sandbox` to provision Cognito.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,  // Username is email; password required.
  },
});