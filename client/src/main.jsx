import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#FF9729', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
