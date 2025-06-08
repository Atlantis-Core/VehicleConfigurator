import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@globals/fonts.css';
import '@globals/global.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
