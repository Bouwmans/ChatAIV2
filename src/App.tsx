import { AuthForm } from './components/AuthForm';
import { ChatLayout } from './components/ChatLayout';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { status, user, error, signIn, signUp, confirmSignUp, resendSignUp, signOut } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black text-slate-200">
        <p className="animate-pulse text-sm uppercase tracking-[0.3em] text-sky-300">Preparing launch…</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-space-black via-space-gray to-space-blue p-6">
        <AuthForm
          onSignIn={async ({ username, password }) => {
            await signIn({ username, password });
          }}
          onSignUp={async ({ username, password, email }) => {
            await signUp({ username, password, email });
          }}
          onConfirm={async (username, code) => {
            await confirmSignUp(username, code);
          }}
          onResend={async (username) => {
            await resendSignUp(username);
          }}
          error={error}
        />
      </div>
    );
  }

  return <ChatLayout username={user.username} email={user.email} onSignOut={signOut} />;
};

export default App;
