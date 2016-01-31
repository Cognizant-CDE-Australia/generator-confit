import React from 'react';

export default class Page1 extends React.Component {
  render() {
    let onClick = function() {
      return this.props.gotoPage('page2');
    }.bind(this);
    let logo = require('../assets/img/blank-logo.png');

    return (<div className="page1">
      <h1>This is page 1</h1>
      <img src={logo} />
      <a className="btn" onClick={onClick}>Page 2</a>
    </div>);
  }
}
