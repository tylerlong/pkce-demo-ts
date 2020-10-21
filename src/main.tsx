import {Component} from 'react-subx';
import {StoreType, authorizeUri} from './store';
import React from 'react';
import {Button, Input} from 'antd';

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
    return store.token ? <Form store={store} /> : <Login />;
  }
}

class Login extends Component {
  render() {
    return (
      <Button type="primary">
        <a href={authorizeUri}>
          Click to start {'"'}Authorization Code Grant + Proof Key for Code
          Exchange{'"'}
        </a>
      </Button>
    );
  }
}

class Form extends Component<PropsStore> {
  render() {
    const store = this.props.store;
    return (
      <>
        <Input placeholder="To number" />
        <Input.TextArea rows={4} placeholder="Message body" />
        <input type="file" />
      </>
    );
  }
}

export default App;
