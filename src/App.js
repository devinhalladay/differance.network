import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Switch } from 'react-router';


import Home from './components/Home'
import Diptych from './components/Diptych'
import SavedDiptych from './components/SavedDiptych'
import { timingSafeEqual } from 'crypto';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: '',
      channelData: [],
      url: '',
      redirect: false
    };

    this.setChannelData = this.setChannelData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.unsetRedirect = this.unsetRedirect.bind(this);
    this.unsetChannel = this.unsetChannel.bind(this);
    this.setStateFromURL = this.setStateFromURL.bind(this);
  }

  setChannelData(res) {
    this.setState({
      channelData: res
    });
  }

  unsetRedirect() {
    this.setState({
      redirect: false
    })
  }

  setStateFromURL() {
    let chanParts = window.location.pathname.split('/');
    let chan = chanParts[1];

    this.setState({
      channel: chan,
      url: chan
    })
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }


  handleSubmit(e) {
    e.preventDefault();
    let chanParts = this.chanInput.value.split('/');
    let chan = chanParts[1];

    this.setState({
      url: this.chanInput.value,
      channel: chan,
      redirect: true
    });
  }

  unsetChannel() {
    this.setState({
      channel: null,
      url: null
    })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className="site-title">
            <Link onClick={this.unsetChannel} to="/">Différance.Network</Link>
          </div>

          <section className="form">
            <form style={{ right: this.state.channel ? '8em' : '20px' }}className="channel-url-form" onSubmit={this.handleSubmit}>
              <input placeholder="Are.na channel URL" defaultValue={this.state.url} type="text" ref={ (input) => this.chanInput = input } />
              <input type="submit" value={window.innerWidth > 800 ? "Show me the way →" : "Go →" } />
            </form>
          </section>

          {this.state.redirect ? <Redirect to={this.state.channel} push /> : ''}

          <Switch>
            <Route 
              exact
              path="/"
              render={(props) => <Home {...props} />} 
            />
            {/* <Route
              path="/:channel/:verso/:recto"
              render={(props) =>
                <SavedDiptych {...props}
                  chan={this.state.channel}
                  setChannelData={this.setChannelData}
                  channelData={this.state.channelData}
                  unsetRedirect={this.unsetRedirect}
                  setStateFromURL={this.setStateFromURL}
                  key={this.state.channel}
                />
              }
            /> */}
            <Route 
              path="/:channel/:verso/:verso" 
              render={(props) => 
                <Diptych {...props} 
                  chan={this.state.channel} 
                  setChannelData={this.setChannelData} 
                  channelData={this.state.channelData} 
                  unsetRedirect={this.unsetRedirect}
                  setStateFromURL={this.setStateFromURL}
                  key={this.state.channel}
                />
              }
            />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
