import { Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import type { AuthUser } from 'aws-amplify/auth';
import { ChatApp } from './components/ChatApp';
import type { User } from './types';
import '@aws-amplify/ui-react/styles.css';

const mapAuthUserToUser = (authUser: AuthUser): User => ({
  username: authUser.username,
  userId: authUser.userId,
  email: authUser.signInDetails?.loginId ?? authUser.username,
});

function App() {
  return (
    <Authenticator
      hideSignUp={false}
      components={{
        Header() {
          return (
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                ChatAI V2
              </h1>
              <p className="text-tesla-text-secondary">
                Powered by AWS Bedrock & Claude
              </p>
            </div>
          );
        },
        Footer() {
          return (
            <div className="text-center py-4">
              <p className="text-sm text-tesla-text-secondary">
                Secure • Private • Intelligent
              </p>
            </div>
          );
        },
      }}
    >
      {({ signOut, user }) => {
        const appUser = user ? mapAuthUserToUser(user) : undefined;
        const handleSignOut = signOut ?? (() => {});

        if (!appUser) {
          return <></>;
        }

        return (
          <Routes>
            <Route
              path="/"
              element={<ChatApp user={appUser} signOut={handleSignOut} />}
            />
          </Routes>
        );
      }}
    </Authenticator>
  );
}

export default App;
