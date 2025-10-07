// frontend/src/App.tsx (fixed TS errors: Branch signUp/signIn checks)
import { useState, useRef, useEffect } from 'react';
import { signIn, signUp, confirmSignUp, fetchUserAttributes, signOut, getCurrentUser } from 'aws-amplify/auth';
import { sendChatMessage } from './graphql/chat';
import type { SignInInput, SignUpInput, ConfirmSignUpInput } from 'aws-amplify/auth';

export default function App() {
  const [formState, setFormState] = useState<'signIn' | 'signUp' | 'confirmSignUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // Check if logged in on load.
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setUserEmail(user.username);
    }).catch(() => {});
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let result;
      if (formState === 'signUp') {
        const signUpInput: SignUpInput = { username: email, password, options: { userAttributes: { email } } };
        result = await signUp(signUpInput);
        if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP_WITH_CODE') {  // Fixed: Check signUpStep (type-safe).
          setFormState('confirmSignUp');  // Switch to confirm form.
          alert('Check your email for verification code!');
        }
      } else if (formState === 'confirmSignUp') {
        const confirmInput: ConfirmSignUpInput = { username: email, confirmationCode };
        result = await confirmSignUp(confirmInput);
        if (result.nextStep.signUpStep === 'DONE' || result.isSignUpComplete) {  // Fixed: Check isSignUpComplete.
          alert('Sign up complete! Now sign in.');
          setFormState('signIn');
          setConfirmationCode('');
        }
      } else {  // signIn
        const signInInput: SignInInput = { username: email, password };
        result = await signIn(signInInput);
        if (result.nextStep.signInStep === 'DONE') {  // Fixed: Only check for signIn (type-safe).
          const attributes = await fetchUserAttributes();
          setUserEmail(attributes.email ?? '');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserEmail('');
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(userMsg.text);
      setMessages((prev) => [...prev, { role: 'ai' as const, text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai' as const, text: 'Error: Could not reach AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) {
    // Auth form (updated with confirmSignUp).
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', fontFamily: 'Arial' }}>
        <h1>Chatbot Login</h1>
        <form onSubmit={handleAuthSubmit}>
          <h2>{formState === 'signUp' ? 'Sign Up' : formState === 'confirmSignUp' ? 'Confirm Code' : 'Sign In'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
          />
          {formState !== 'confirmSignUp' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
            />
          )}
          {formState === 'confirmSignUp' && (
            <input
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%' }}
            />
          )}
          <button type="submit" style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
            {formState === 'signUp' ? 'Sign Up' : formState === 'confirmSignUp' ? 'Confirm' : 'Sign In'}
          </button>
          {formState !== 'confirmSignUp' && (
            <button
              type="button"
              onClick={() => setFormState(formState === 'signIn' ? 'signUp' : 'signIn')}
              style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
            >
              Switch to {formState === 'signIn' ? 'Sign Up' : 'Sign In'}
            </button>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  // Chat UI post-login (unchanged).
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial' }}>
      <div style={{ width: '300px', padding: '1rem', background: '#f0f0f0', borderRight: '1px solid #ccc' }}>
        <h2>Chats</h2>
        <p>Logged in: {userEmail}</p>
        <button onClick={handleSignOut}>Sign Out</button>
        {/* Later: List past convos */}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                margin: '0.5rem 0',
                color: msg.role === 'user' ? 'blue' : 'green',
              }}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Claude'}:</strong> {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ flex: 1, padding: '0.5rem', marginRight: '0.5rem' }}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}