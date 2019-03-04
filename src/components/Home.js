import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="info">
          <p>Différance.Network is a free utility for generating unexpected connections between disparate pieces of content. Just enter an <a target="_blank" href="http://are.na">Are.na</a> URL and click the big button. Inspired by <a target="_blank" href="https://disintegrate.herokuapp.com/"><em>Disintegrate</em></a> by <a target="_blank" href="https://devinhalladay.com">Devin Halladay</a> and <a target="_blank" href="http://there.am">there.am</a> by <a target="_blank" href="https://twitter.com/realstevehere">Steve</a>.</p>
          <p>The source is <a target="_blank" href="https://github.com/devinhalladay/differance.network">available to you</a>, as always. Every good tool should be open source. Everyone deserves access to ideas, access to tools, access to means and access to ends.</p>
        </section>
      </React.Fragment>
    )
  }
}