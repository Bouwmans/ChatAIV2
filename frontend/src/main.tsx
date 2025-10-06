// frontend/src/main.tsx (update the entry point)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'aws-amplify/adapter-nextjs';  // Adapter for Vite (polyfills fetch, etc.).
import outputs from './amplify_outputs.json';  // Your backend config.
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);  // Loads Cognito details (client ID, region, etc.).

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);