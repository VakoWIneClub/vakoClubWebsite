import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import '@/quill-custom.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);