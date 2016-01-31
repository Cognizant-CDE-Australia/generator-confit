import React from 'react';

export default class Page2 extends React.Component {
  render() {
    let onClick = function() {
      return this.props.gotoPage('page1');
    }.bind(this);

    return (<div className="page2">
      <h2>This is page 2</h2>
      <a onClick={onClick} className="btn icon icon-menu-expand">Page 1</a>
    </div>);
  }
}
