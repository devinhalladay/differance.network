import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Switch } from 'react-router';

import Home from './components/Home'
import Diptych from './components/Diptych'

const apiInit = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
};

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
    this.pickRandomChannel = this.pickRandomChannel.bind(this);
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

  getRandomChannels() {
    let endpoint = `https://api.are.na/v2/channels?page=${Math.floor(Math.random() * 80) + 40}&amp;per=40`

    return fetch(endpoint, apiInit)
      .then((response) => {
        return response.json();
      })
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  }

  handleSubmit(e) {
    e.preventDefault();
    let chanParts = this.chanInput.value.split('/');
    let chan = chanParts.pop() || chanParts.pop();

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

    this.chanInput.value = ''
  }

  async pickRandomChannel() {
    let randomChannels;
    let channels;
    let channel;
    let slug;
    let user;
    let that = this;

    randomChannels = await that.getRandomChannels();
    channels = randomChannels.channels;
    channel = channels[Math.floor(Math.random() * channels.length)]

    slug = channel.slug;
    user = channel.user.slug;

    if (channel.length < 2) {
      this.pickRandomChannel();
    } else {
      this.setState({
        url: `${slug}`,
        channel: `${slug}`,
        redirect: true,
      })

      this.chanInput = `${slug}`
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <div class="control-center" style={{ width: this.state.channel ? 'calc(100% - 104px)' : 'calc(100% - 40px)' }}>
            <div className="site-title">
              <Link onClick={this.unsetChannel} to="/">Différance.Network</Link>
            </div>

            <section className="form">
              <form className="channel-url-form" onSubmit={this.handleSubmit}>
                <input placeholder="Are.na channel URL" defaultValue={this.state.url} type="text" ref={ (input) => this.chanInput = input } />
                <input type="submit" value={window.innerWidth > 800 ? "Show me the way →" : "Go →" } />
              </form>
            </section>
  
            <button className="random-button" onClick={() => this.pickRandomChannel()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shuffle"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg></button>
          </div>

          {this.state.redirect ? <Redirect to={`/${this.state.channel}`} push /> : ''}

          <Switch>
            <Route 
              exact
              path="/"
              render={(props) => <Home {...props} />} 
            />
            <Route 
              path={["/:channel/:verso/:recto", "/:channel"]} 
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
