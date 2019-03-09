import React, { Component } from 'react';
import Clipboard from 'react-clipboard.js';
import { Redirect } from 'react-router-dom';

import Sheet from './Sheet'

const apiInit = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
};

export default class Diptych extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versoBlock: null,
      rectoBlock: null,
      rectoBlockType: null,
      versoBlockType: null,
      versoBlockID: null,
      rectoBlocID: null,
      loading: true,
      redirect: false,
      tooltip: false
    }
  }

  componentWillMount() {
    this.props.setStateFromURL();
  }

  componentDidMount() {
    this.setState({ loading: true });

    if (this.props.match.params.verso || this.props.match.params.recto) {
      this.getBlocksData();
    } else {
      this.getChannelData();
    }

    this.props.unsetRedirect();
  }

  apiCall(type, path, params) {
    let endpoint; 

    if (type === 'block') {
      endpoint = `https://api.are.na/v2/blocks/${path}`
    } else if (type === 'channel') {
      endpoint = `https://api.are.na/v2/channels/${(this.props.chan !== '') ? this.props.chan : this.getLastDirFromURL()}`
      if (params) {
        let pageNumber = params.page
        let pageLength = params.per
        endpoint = endpoint + "?page=" + pageNumber + "&amp;per=" + pageLength
      }
    }

    return fetch(endpoint, apiInit)
      .then((response) => {
        return response.json();
      })
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getLastDirFromURL() {
    let loc = window.location.href;
    loc = loc.lastIndexOf('/') == loc.length - 1 ? loc.substr(0, loc.length - 1) : loc.substr(0, loc.length + 1);
    let targetValue = loc.substr(loc.lastIndexOf('/') + 1);
    return targetValue
  }

  async getChannelData() {
    var itemsPerPage = 25;
    var concatArr = [];
    var chan = (this.props.chan !== '') ? this.props.chan : this.getLastDirFromURL();
    let blockArray = [];

    let numBlocks = (await this.apiCall('channel', chan)).length
    let totalPages = Math.ceil(numBlocks / itemsPerPage);

    if (this.props.channelData) {
      for (let i = 0; i < totalPages; i++) {
        blockArray.push((await this.apiCall('channel', chan, {
          page: i,
          per: itemsPerPage
        })).contents)
      }
    }

    concatArr.contents = [].concat.apply([], blockArray);
    this.shuffle(concatArr.contents);
    this.props.setChannelData(concatArr.contents);

    this.setState({
      versoBlock: this.props.channelData.slice(0, 2)[0],
      rectoBlock: this.props.channelData.slice(0, 2)[1],
      loading: false
    })

    this.setState({
      versoBlockType: this.state.versoBlock.class,
      rectoBlockType: this.state.rectoBlock.class,
      versoBlockID: this.state.versoBlock.id,
      rectoBlockID: this.state.rectoBlock.id,
    })
  }

  async getBlocksData() {
    let fetchedVersoBlock = await this.apiCall('block', this.props.match.params.verso);
    let fetchedRectoBlock = await this.apiCall('block', this.props.match.params.recto);

    this.setState({
      versoBlock: fetchedVersoBlock,
      rectoBlock: fetchedRectoBlock,
      loading: false
    })

    this.setState({
      versoBlockType: fetchedVersoBlock.class,
      rectoBlockType: fetchedRectoBlock.class,
    })
  }

  refresh() {
    this.setState({
      redirect: true
    })
    this.getChannelData();
  }

  handleClipboardCopy() {
    this.setState({ tooltip: true })

    setTimeout(() => {
      this.setState({ tooltip: false })
    }, 1000)
  }

  render() {
    const tooltipStyle = {
      display: this.state.tooltip ? 'block' : 'none'
    }

    if (this.state.versoBlock && this.state.rectoBlock) {
      return (
        <React.Fragment>
          {
            this.state.redirect ? <Redirect push to={`/${this.props.chan}`} /> : null
          }
          
          <button className="reload-button" onClick={() => this.refresh()}>
            <svg width="22px" height="22px" viewBox="0 0 22 22">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="check-circle" transform="translate(11.000000, 11.000000) rotate(-315.000000) translate(-11.000000, -11.000000) translate(-3.000000, -3.000000)">
                  <path d="M24,13.08 L24,14 C23.9974678,18.4286859 21.082294,22.328213 16.8353524,23.583901 C12.5884109,24.839589 8.02139355,23.1523121 5.61095509,19.4370663 C3.20051662,15.7218205 3.52086345,10.863639 6.39827419,7.49707214 C9.27568494,4.13050531 14.0247126,3.05752528 18.07,4.86" id="Path" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(13.999972, 13.994426) rotate(-30.000000) translate(-13.999972, -13.994426) "></path>
                  <path d="M18.2402873,4.43412157 L12.7480695,7.57253173 C12.5083107,7.70953672 12.2028834,7.62623835 12.0658784,7.38647963 C12.0227077,7.31093078 12,7.22542363 12,7.13841016 L12,0.861589839 C12,0.585447464 12.2238576,0.361589839 12.5,0.361589839 C12.5870135,0.361589839 12.6725206,0.384297498 12.7480695,0.427468268 L18.2402873,3.56587843 C18.480046,3.70288341 18.5633443,4.00831075 18.4263394,4.24806947 C18.3820447,4.32558511 18.3178029,4.38982692 18.2402873,4.43412157 Z" id="Triangle" fill="#000000" fill-rule="nonzero"></path>
                </g>
              </g>
            </svg>
          </button>
          <div className="dyptich">
            <Sheet 
              side="verso" 
              block={this.state.versoBlock} 
              blockType={this.state.versoBlockType}>
            </Sheet>
            <Sheet 
              side="recto" 
              block={this.state.rectoBlock} 
              blockType={this.state.rectoBlockType}>
            </Sheet>
          </div>
          <div class="meta-buttons">
            <div className="copy-button__container">
              <p style={tooltipStyle}>Copied!</p>
  
              <Clipboard 
                onClick={this.handleClipboardCopy.bind(this)}
                className="copy-button" 
                data-clipboard-text={(this.props.match.params.verso || this.props.match.params.recto) ? `${window.location.href}` : `${window.location.protocol}/${window.location.host}/${this.props.chan}/${this.state.versoBlockID}/${this.state.rectoBlockID}`
              }>
                Copy Permalink
              </Clipboard>
              
            </div>
  
            <a className="button visit-button" target="_blank" rel="noopener noreferrer" href={`https://are.na/${this.state.versoBlock.user.slug}/${this.props.match.params.channel}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            </a>
          </div>
        </React.Fragment>
      )
    } else if (this.state.loading === true) {
      return (
        <p>Loading…</p>
      )
    } else {
      return (
        <p>Channel not found. Why not <a href="https://www.are.na/">create it</a>?</p>
      )
    }
  }
}