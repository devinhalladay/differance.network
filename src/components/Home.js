import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.history.push(this.props.chan)
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>
            Channel:
            <input type="text" onChange={this.props.handleChange}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    )
  }
}