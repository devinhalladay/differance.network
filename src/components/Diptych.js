import React, { Component } from 'react';
import axios from 'axios';
import { iif } from 'rxjs';
import Recto from './Recto'
import Verso from './Verso'

const Arena = require('are.na');
const arena = new Arena();



const apiInit = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
};

let title;
let blockType;

export default class Diptych extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versoBlock: null,
      rectoBlock: null,

      rectoBlockType: null,
      rectoImgSrc: null,
      rectoLinkUrl: null,
      rectoText: null,

      versoBlockType: null,
      versoImgSrc: null,
      versoLinkUrl: null,
      versoText: null
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

  async componentDidMount() {
    var itemsPerPage = 25;
    var concatArr = [];
    var chan = (this.props.chan !== '') ? this.props.chan : this.getLastDirFromURL();
    let blockArray = [];

    let numBlocks = (await this.apiCall(chan)).length
    let totalPages = Math.ceil(numBlocks / itemsPerPage);

    title = (await this.apiCall(chan)).title

    for (let i = 0; i < totalPages; i++) {
      blockArray.push((await this.apiCall(chan, {
        page: i,
        per: itemsPerPage
      })).contents)
    }

    concatArr.contents = [].concat.apply([], blockArray);
    this.shuffle(concatArr.contents);
    this.props.setChannelData(concatArr.contents);

    this.setState({
      versoBlock: this.props.channelData.slice(0, 2)[0],
      rectoBlock: this.props.channelData.slice(0, 2)[1],
    })

    this.setState({
      versoBlockType: this.state.versoBlock.class,
      rectoBlockType: this.state.rectoBlock.class,
    })
  }

  render() {
    return (
      <div className="dyptich">
        <h2>{title}</h2>
        <Verso block={this.state.versoBlock} blockType={this.state.versoBlockType}></Verso>
        <Recto block={this.state.rectoBlock} blockType={this.state.rectoBlockType}></Recto>
      </div>
    )
  }
}