import {Component} from 'react-subx';
import {StoreType, authorizeUri} from './store';
import React from 'react';

type PropsStore = {
  store: StoreType;
};

class App extends Component<PropsStore> {
  render() {
    const store = this.props.store;
    return store.ready ? <Main store={store} /> : 'Loading...';
  }
}

class Main extends Component<PropsStore> {
  render() {
    const store = this.props.store;
    return store.token ? <Token store={store} /> : <Login />;
  }
}

class Token extends Component<PropsStore> {
  render() {
    const store = this.props.store;
    return <pre>{JSON.stringify(store.token, null, 2)}</pre>;
  }
}

class Login extends Component {
  render() {
    return (
      <a href={authorizeUri}>
        Click to start {'"'}Authorization Code Grant + Proof Key for Code
        Exchange{'"'}
      </a>
    );
  }
}

export default App;
