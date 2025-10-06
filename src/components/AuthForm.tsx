import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type Mode = 'signIn' | 'signUp' | 'confirm';

type AuthFormProps = {
  onSignIn: (params: { username: string; password: string }) => Promise<void>;
  onSignUp: (params: { username: string; password: string; email: string }) => Promise<void>;
  onConfirm: (username: string, code: string) => Promise<void>;
  onResend: (username: string) => Promise<void>;
  error?: string | null;
};

export const AuthForm = ({ onSignIn, onSignUp, onConfirm, onResend, error }: AuthFormProps) => {
  const [mode, setMode] = useState<Mode>('signIn');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      await onSignIn({ username, password });
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setStatus('idle');
    }
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      await onSignUp({ username, password, email });
      setMessage('Verification code sent to your email.');
      setMode('confirm');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setStatus('idle');
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      await onConfirm(username, code);
      setMessage('Account verified. You can now sign in.');
      setMode('signIn');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setStatus('idle');
    }
  };

  const handleResend = async () => {
    setStatus('loading');
    setMessage(null);
    try {
      await onResend(username);
      setMessage('Verification code resent.');
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setStatus('idle');
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signUp':
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
            />
            <InputField
              label="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
            />
            <SubmitButton isLoading={status === 'loading'}>Create account</SubmitButton>
          </form>
        );
      case 'confirm':
        return (
          <form onSubmit={handleConfirm} className="space-y-4">
            <InputField
              label="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              required
            />
            <InputField
              label="Confirmation code"
              value={code}
              onChange={setCode}
              inputMode="numeric"
              required
            />
            <div className="flex items-center justify-between gap-4">
              <SubmitButton isLoading={status === 'loading'}>Verify</SubmitButton>
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-sky-400 hover:text-sky-300"
              >
                Resend code
              </button>
            </div>
          </form>
        );
      default:
        return (
          <form onSubmit={handleSignIn} className="space-y-4">
            <InputField
              label="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
            <SubmitButton isLoading={status === 'loading'}>Sign in</SubmitButton>
          </form>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md rounded-2xl bg-space-gray/70 p-10 shadow-glow backdrop-blur"
    >
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-wide text-white">
        Amplify Bedrock Chat
      </h1>
      {message && <p className="mb-4 text-sm text-emerald-400">{message}</p>}
      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      {renderForm()}
      <div className="mt-6 text-center text-sm text-slate-300">
        {mode === 'signIn' ? (
          <button
            type="button"
            className="text-sky-400 hover:text-sky-300"
            onClick={() => setMode('signUp')}
          >
            Need an account? Sign up
          </button>
        ) : mode === 'signUp' ? (
          <button
            type="button"
            className="text-sky-400 hover:text-sky-300"
            onClick={() => setMode('signIn')}
          >
            Already registered? Sign in
          </button>
        ) : (
          <button
            type="button"
            className="text-sky-400 hover:text-sky-300"
            onClick={() => setMode('signIn')}
          >
            Back to sign in
          </button>
        )}
      </div>
    </motion.div>
  );
};

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  required?: boolean;
};

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  required,
}: InputFieldProps) => (
  <label className="block text-left text-sm font-medium text-slate-200">
    <span className="mb-2 block uppercase tracking-widest text-xs text-slate-400">{label}</span>
    <input
      className="w-full rounded-xl border border-white/10 bg-space-black/80 px-4 py-3 text-white transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      required={required}
    />
  </label>
);

type SubmitButtonProps = {
  children: ReactNode;
  isLoading: boolean;
};

const SubmitButton = ({ children, isLoading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    className={cn(
      'flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-slate-900 shadow-glow transition hover:from-sky-400 hover:to-cyan-300',
      isLoading && 'opacity-60',
    )}
  >
    {isLoading ? 'Processing…' : children}
  </button>
);
