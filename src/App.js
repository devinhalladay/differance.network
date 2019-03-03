import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {withRouter} from 'react-router';
import './App.css';

import Home from './components/Home'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: '',
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    
  }

  handleChange(e) {
    this.setState({
      channel: e.target.value
    });
  }

  render() {
    return (
      <Router>
        <Route 
          exact
          path="/"
          render={(props) => <Home {...props} shouldRedirect={this.state.redirect} chan={this.state.channel} handleChange={this.handleChange}/>} 
        />
      </Router>
    )
  }
}

export default App;
