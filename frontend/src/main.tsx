// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// No adapter import needed for Vite SPA.
import outputs from './amplify_outputs.json';  // Your backend config.
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);  // Loads Cognito/API details.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);