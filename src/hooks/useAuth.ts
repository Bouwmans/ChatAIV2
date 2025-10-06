import { useCallback, useEffect, useState } from 'react';
import {
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
  type SignInInput,
} from 'aws-amplify/auth';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthUser = {
  username: string;
  email?: string;
};

export const useAuth = () => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const email =
        session.tokens?.idToken?.payload?.email || currentUser.signInDetails?.loginId;
      setUser({ username: currentUser.username, email: email ?? undefined });
      setStatus('authenticated');
    } catch (err) {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const handleSignIn = useCallback(
    async (input: SignInInput) => {
      try {
        setError(null);
        const result = await signIn(input);
        if (result.isSignedIn) {
          await loadUser();
        }
        return result;
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    [loadUser],
  );

  const handleSignUp = useCallback(
    async (params: { username: string; password: string; email: string }) => {
      try {
        setError(null);
        const { username, password, email } = params;
        await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email,
            },
          },
        });
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    [],
  );

  const handleConfirm = useCallback(async (username: string, code: string) => {
    try {
      setError(null);
      await confirmSignUp({ username, confirmationCode: code });
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const handleResend = useCallback(async (username: string) => {
    try {
      setError(null);
      await resendSignUpCode({ username });
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  return {
    status,
    user,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirm,
    resendSignUp: handleResend,
    signOut: handleSignOut,
    refresh: loadUser,
  } as const;
};
