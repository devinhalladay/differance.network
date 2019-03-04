import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import {Switch, withRouter} from 'react-router';
import PropTypes from "prop-types";


import Home from './components/Home'
import Diptych from './components/Diptych'


class App extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      channel: '',
      channelData: [],
      url: '',
      toSheets: false
    };

    this.setChannelData = this.setChannelData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setChannelData(res) {
    this.setState({
      channelData: res
    });
  }

  handleSubmit(e) {
    // this.props.history.push(chan);
    e.preventDefault();
    let chanParts = this.chanInput.value.split('/');
    let chan = chanParts.pop() || chanParts.pop();
    // this.context.router.history.push(chan);

    this.setState({
      url: this.chanInput.value,
      channel: chan,
      toSheets: true
    });

    console.log(chan);
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className="site-title">
            <Link to="/">Différance.Network</Link>
          </div>

          <section className="form">
            <form className="channel-url-form" onSubmit={this.handleSubmit}>
              <input placeholder="Are.na channel URL" defaultValue={this.state.url} type="text" ref={ (input) => this.chanInput = input } />
              <input type="submit" value="Show me the way →" />
            </form>
          </section>

          {this.state.toSheets ? <Redirect to={this.state.channel} push /> : ''}

          <Switch>
            <Route 
              exact
              path="/"
              render={(props) => <Home {...props} />} 
              />
              <Route path="/:channel" render={(props) => <Diptych {...props} chan={this.state.channel} setChannelData={this.setChannelData} channelData={this.state.channelData} />} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default withRouter(App);
