import './index.css';

import React from 'react';
import {createRoot} from 'react-dom/client';

import store from './store';
import App from './main';

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);

(async () => {
  await store.init();
  store.ready = true;
})();
