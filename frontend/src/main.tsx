// frontend/src/main.tsx (updated: Removed adapter-nextjs import)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// No adapter needed for Vite—Amplify handles client-side directly.
import outputs from './amplify_outputs.json';  // Ensure this file is copied from root.
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);  // Wires up auth/data to your backend (Cognito, GraphQL).

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);