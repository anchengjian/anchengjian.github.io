'use strict';

var React = require('react');

var NotFound = React.createClass({
  render: function (){
    return (
      <h2 style={{textAlign:'center'}}>404 Not Found</h2>
    );
  }
});

module.exports = NotFound;