import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/styles/globals.css';

// Redux imports
import { Provider } from 'react-redux';
// @ts-expect-error | Typescript's importing of JS files sucks...
import { store } from './redux/store.js'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
