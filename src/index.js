// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// $FlowIgnore - we don't want the missing dom element to be a silent error.
ReactDOM.render(<App />, document.querySelector('#root'));
registerServiceWorker();
