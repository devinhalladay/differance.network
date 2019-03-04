import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Switch, withRouter} from 'react-router';

import Home from './components/Home'
import Diptych from './components/Diptych'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: '',
      channelData: [],
      url: '',
      toSheets: false
    };

    this.setChannelData = this.setChannelData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      url: this.chanInput.value,
      channel: this.chanInput.value.substr(this.chanInput.value.lastIndexOf('/') + 1)
    });
  }

  setChannelData(res) {
    this.setState({
      channelData: res
    });
  }

  handleSubmit(e) {
    // this.props.history.push(chan);
    e.preventDefault();
    let chan = this.chanInput.value;
    this.props.history.push(chan)

    this.setState({
      url: this.chanInput.value,
      channel: chan
    });

    console.log(chan);
  }

  render() {
    return (
      <Router>
        <React.Fragment>
          <div className="site-title">
            <Link to="/">Différance.Network</Link>
          </div>

          <section className="form">
            <form className="channel-url-form" onSubmit={this.handleSubmit.bind(this)}>
              <input placeholder="Are.na channel URL" defaultValue={this.state.url} type="text" ref={ (input) => this.chanInput = input } />
              <input type="submit" value="Show me the way →" />
            </form>
          </section>

          <Switch>
            <Route 
              exact
              path="/"
              render={(props) => <Home {...props} />} 
              />
              <Route path="/:channel" render={(props) => <Diptych {...props} chan={this.state.channel} setChannelData={this.setChannelData} channelData={this.state.channelData} />} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App;
