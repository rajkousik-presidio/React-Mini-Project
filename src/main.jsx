import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { PortfolioProvider } from './contexts/PortfolioContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioProvider>
      <Router>
        <App />
      </Router>
    </PortfolioProvider>
  </React.StrictMode>
);
