import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <>
      <ScrollToTopOnRouteChange />
      <App />
      <ScrollToTopButton />
    </>
  </BrowserRouter>,
);
