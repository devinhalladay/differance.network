import React, { Component } from 'react';
import axios from 'axios';

const Arena = require('are.na');
const arena = new Arena();

const apiInit = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
};

let title;

export default class Diptych extends Component {
  constructor(props) {
    super(props);
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

  getLastDirFromURL() {
    let loc = window.location.href;
    loc = loc.lastIndexOf('/') == loc.length - 1 ? loc.substr(0, loc.length - 1) : loc.substr(0, loc.length + 1);
    let targetValue = loc.substr(loc.lastIndexOf('/') + 1);
    console.log(targetValue);
    return targetValue
  }

  

  async componentWillMount() {
    
    var itemsPerPage = 25;
    var concatArr = [];
    var chan = (this.props.chan !== '') ? this.props.chan : this.getLastDirFromURL();
    var setChannelData = this.props.setChannelData;
    let blockArray = [];
    
    let numBlocks = (await this.apiCall(chan)).length
    let totalPages = Math.ceil(numBlocks / itemsPerPage);
    let currPage = totalPages;
    let iniPage = currPage;

    title = (await this.apiCall(chan)).title

    for (let i = 0; i < totalPages; i++) {
      blockArray.push((await this.apiCall(chan, {
        page: i,
        per: itemsPerPage
      })).contents)
    }

    concatArr.contents = [].concat.apply([], blockArray);

    console.log(concatArr.contents);

    this.props.setChannelData(concatArr.contents)
  }

  render() {
    return (
      <React.Fragment>
        <h1>{title}</h1>
        {/* <p>{this.props.channelData}</p> */}
      </React.Fragment>
    )
  }
}