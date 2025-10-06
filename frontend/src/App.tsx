// frontend/src/App.tsx
import { useState } from 'react';
import { signIn, signUp, fetchUserAttributes, signOut } from 'aws-amplify/auth';
import type { SignInInput, SignUpInput } from 'aws-amplify/auth';

/**
 * Simple auth form: Sign up or sign in with email/password.
 * - On success, fetch user email and log "Welcome!".
 * - Errors: Handle common ones (e.g., user exists, invalid password).
 * - Why fetchUserAttributes? Confirms session; email is verified post-signup.
 */
export default function App() {
  const [formState, setFormState] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let result;
      if (formState === 'signUp') {
        // Sign up: Cognito sends verification code to email.
        const signUpInput: SignUpInput = { username: email, password, options: { userAttributes: { email } } };
        result = await signUp(signUpInput);
        alert('Check your email for verification code! Then sign in.');  // In prod, use a better UX.
      } else {
        // Sign in: Uses PASSWORD flow (default).
        const signInInput: SignInInput = { username: email, password };
        result = await signIn(signInInput);
      }

      if (result.nextStep.signInStep === 'DONE' || result.isSignedUp) {
        // Fetch user details post-auth.
        const attributes = await fetchUserAttributes();
        setUserEmail(attributes.email ?? '');
        alert(`Success! Welcome, ${attributes.email}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserEmail('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Chatbot Prototype</h1>
      {userEmail ? (
        <div>
          <p>Logged in as: {userEmail}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          {/* Task 3 will add chat here */}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>{formState === 'signUp' ? 'Sign Up' : 'Sign In'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (8+ chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{formState === 'signUp' ? 'Sign Up' : 'Sign In'}</button>
          <button type="button" onClick={() => setFormState(formState === 'signIn' ? 'signUp' : 'signIn')}>
            Switch to {formState === 'signIn' ? 'Sign Up' : 'Sign In'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}