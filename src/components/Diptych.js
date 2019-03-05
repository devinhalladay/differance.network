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

  apiCall(path, params) {
    let endpoint = `https://api.are.na/v2/channels/${(this.props.chan !== '') ? this.props.chan : this.getLastDirFromURL()}`
    if (params) {
      let pageNumber = params.page
      let pageLength = params.per
      endpoint = endpoint + "?page=" + pageNumber + "&amp;per=" + pageLength
    }
    return fetch(endpoint, apiInit)
      .then((response) => {
        return response.json()
      })
  }

  blockApiCall(blockId) {
    let endpoint = `https://api.are.na/v2/blocks/${blockId}}`
    return fetch(endpoint, apiInit)
      .then((response) => {
        return response.json()
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

    let numBlocks = (await this.apiCall(chan)).length
    let totalPages = Math.ceil(numBlocks / itemsPerPage);

    if (this.props.channelData) {
      for (let i = 0; i < totalPages; i++) {
        blockArray.push((await this.apiCall(chan, {
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
    let fetchedVersoBlock = await this.blockApiCall(this.props.match.params.verso);
    let fetchedRectoBlock = await this.blockApiCall(this.props.match.params.recto);

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
          
          <button className="reload-button" onClick={() => this.refresh()}>Refresh</button>
          <div className="dyptich">
            <Sheet side="verso" block={this.state.versoBlock} blockType={this.state.versoBlockType}></Sheet>
            <Sheet side="recto" block={this.state.rectoBlock} blockType={this.state.rectoBlockType}></Sheet>
          </div>
          <div className="copy-button__container">
            <p style={tooltipStyle}>Copied!</p>
            <Clipboard onClick={this.handleClipboardCopy.bind(this)}
            className="copy-button" 
              data-clipboard-text={(this.props.match.params.verso || this.props.match.params.recto) ? `${window.location.href}` : `${window.location.protocol}/${window.location.host}/${this.props.chan}/${this.state.versoBlockID}/${this.state.rectoBlockID}`
            }>
                Copy Permalink
              </Clipboard>
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