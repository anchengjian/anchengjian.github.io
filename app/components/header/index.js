'use strict';

var React = require('react'),
    style = require('./style.less');

var HeaderBox = React.createClass({
  getInitialState: function(){
    return this;
  },
  render: function (){
    return (
      <header>
        <h1>前端菜鸟</h1>
        <small className="sub-title">前进，前进，不择手段的前进！</small>
      </header>
    );
  }
});

module.exports = HeaderBox;