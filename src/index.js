import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.scss';
import { createBrowserHistory } from 'history';
import App from './App';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

ReactDOM.render(<Router><App history={history} /></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
