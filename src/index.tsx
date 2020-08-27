import React from 'react';
import ReactDOM from 'react-dom';

import store from './store';
import App from './main';

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<App store={store} />, container);

(async () => {
  await store.init();
  store.ready = true;
})();
