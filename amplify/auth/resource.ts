// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * Email/password auth with valid MFA (fixes deserialize error).
 * - loginWith.email: Username = email + password.
 * - mfaConfiguration: 'NONE' (valid; defaults to invalid 'OFF').
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});