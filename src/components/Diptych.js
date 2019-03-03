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

    // let title = iniContents.title
    // let contents = iniContents.contents;

    // console.log(contents);
    
    

    // axios.get(`https://api.are.na/v2/channels/${this.props.chan}`, {
    //   page: 1,
    //   per: itemsPerPage
    // })
    //   .then(res => {
    //     const data = res;
    //     console.log(data);
    //     this.props.setChannelData(res)
    //   })

    // arena
    //   .channel(chan).get({ page: iniPage, per: 100 })
    //   .then(function (res) {
    //     totalPages = Math.ceil(res.length / itemsPerPage);
    //     console.log('Number of blocks', res.length)
    //     console.log('Total pages', totalPages);
    //   }).then(function(res) {
    //     for (let i = iniPage; i < totalPages; i++) {
    //       arena.channel(chan).get({page: i, per: itemsPerPage})
    //       .then(function(res) {
    //         blockArray.push(res.contents);
    //       })
    //     }
    //   }).then(function() {
    //     console.log(blockArray);
    //     concatArr.contents = [].concat.apply([], blockArray);
    //     setChannelData(concatArr)
    //   })
    //   .catch(err => console.log(err))

    // arena.channel(chan).get({ page: iniPage, per: itemsPerPage })
    //   .then(res => {
    //     totalPages = Math.ceil(res.length / itemsPerPage);
    //     console.log('Number of blocks', res.length)
    //     console.log('Total pages', totalPages);
    //     title = res.title
    //     contents = res.contents
    //   }).then(res => {
    //     for (let i = iniPage; i < totalPages; i++) {
    //       arena.channel(chan).get({page: i}).then(res => {
    //         blockArray.push(res.contents)
    //       })
    //     }
    //   }).then(res => {
    //     console.log(blockArray);
        
    //     setChannelData(contents)
    //   })

    
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