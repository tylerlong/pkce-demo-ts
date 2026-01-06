import store, {authorizeUri} from './store';
import React, {useState} from 'react';
import {Button, Divider, Input} from 'antd';
import { auto } from 'manate/react';

const App = auto(() => {
  return store.ready ? <Main /> : 'Loading...';
});

const Main = auto(() => {
  return store.token ? <Form /> : <Login />;
});

const Login = auto(() => {
  return (
    <Button type="primary">
      <a href={authorizeUri}>
        Click to start {'"'}Authorization Code Grant + Proof Key for Code
        Exchange{'"'}
      </a>
    </Button>
  );
});

const Form = auto(() => {
  const [toNumber, setToNumber] = useState('');
  const [messageBody, setMessageBody] = useState('');

  return (
      <>
        <h1>Send MMS</h1>
        <Divider />
        <Input
          placeholder="To number"
          onChange={e => setToNumber(e.target.value)}
        />
        <Input.TextArea
          rows={4}
          placeholder="Message body"
          onChange={e => setMessageBody(e.target.value)}
        />
        <input type="file" id="imageFile" accept="image/png, image/jpeg" />
        <Divider />
        <Button onClick={e => store.sendMms({toNumber, messageBody})}>Send MMS</Button>
      </>
    );
});

export default App;
