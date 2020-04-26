import React, { useState } from 'react';
import './styles.css';

import NoCode from './NoCode';

function Card(props) {
  const { title, children } = props;
  return (
    <div style={{ border: '10px solid red' }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Form(props) {
  const { active = true } = props;
  const [stateName, setStateName] = useState('');

  return (
    <form style={{ border: '6px solid green' }}>
      <p>Hello {stateName} fill this form</p>
      <input
        placeholder="Enter Name"
        type="text"
        value={stateName}
        onChange={event => setStateName(event.target.value)}
      />
      <button disabled={!active}>Submit</button>
    </form>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <NoCode components={{ Card, Form }} />
    </div>
  );
}
