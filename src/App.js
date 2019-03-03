import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {withRouter} from 'react-router';
import './App.css';

import Home from './components/Home'
import Diptych from './components/Diptych'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: '',
      redirect: false,
      channelData: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.setChannelData = this.setChannelData.bind(this);
  }

  handleChange(e) {
    this.setState({
      channel: e.target.value
    });
  }

  setChannelData(res) {
    this.setState({
      channelData: res
    });
  }

  render() {
    return (
      <Router>
      <React.Fragment>
        <Route 
          exact
          path="/"
          render={(props) => <Home {...props} shouldRedirect={this.state.redirect} chan={this.state.channel} handleChange={this.handleChange}/>} 
          />
          <Route path="/:channel" render={(props) => <Diptych {...props} chan={this.state.channel} setChannelData={this.setChannelData} channelData={this.state.channelData} />} />
        </React.Fragment>
      </Router>
    )
  }
}

export default App;
