import {Component} from 'react-subx';
import {StoreType, authorizeUri} from './store';
import React from 'react';
import {Button, Divider, Input} from 'antd';

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
        <h1>Send MMS</h1>
        <Divider />
        <Input
          placeholder="To number"
          onChange={e => this.setState({toNumber: e.target.value})}
        />
        <Input.TextArea
          rows={4}
          placeholder="Message body"
          onChange={e => this.setState({messageBody: e.target.value})}
        />
        <input type="file" id="imageFile" accept="image/png, image/jpeg" />
        <Divider />
        <Button onClick={e => store.sendMms(this.state)}>Send MMS</Button>
      </>
    );
  }
}

export default App;
