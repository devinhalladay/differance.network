import React, { Component } from 'react';
import Clipboard from 'react-clipboard.js';
import Sheet from './Sheet'

const Arena = require('are.na');
const arena = new Arena();



const apiInit = {
  method: 'GET',
  mode: 'cors',
  cache: 'no-cache'
};

let title;
let blockType;

export default class SavedDiptych extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versoBlock: null,
      rectoBlock: null,
      rectoBlockType: null,
      versoBlockType: null,
      loading: true
    }
  }

  apiCall(blockId) {
    let endpoint = `https://api.are.na/v2/blocks/${blockId}}`
    return fetch(endpoint, apiInit)
      .then((response) => {
        return response.json()
      })
  }

  async getBlocks() {
    let fetchedVersoBlock = await this.apiCall(this.props.match.params.verso);
    let fetchedRectoBlock = await this.apiCall(this.props.match.params.recto);

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
    this.getBlocks();
    this.props.unsetRedirect();
  }

  refresh() {
    this.getBlocks();
  }

  render() {
    if (this.state.versoBlock && this.state.rectoBlock) {
      return (
        <React.Fragment>
          <div className="dyptich">
            <Sheet side="verso" block={this.state.versoBlock} blockType={this.state.versoBlockType}></Sheet>
            <Sheet side="recto" block={this.state.rectoBlock} blockType={this.state.rectoBlockType}></Sheet>
          </div>
          <Clipboard className="copy-button" data-clipboard-text={window.location.href}>
            Copy Permalink
          </Clipboard>
        </React.Fragment>
      )
    } else if (this.state.loading == true) {
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