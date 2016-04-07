'use strict';

var React = require('react');

var NotFound = React.createClass({
  render: function (){
    return (
      <section className="not-found">
        <h2 style={{textAlign:'center'}}>404</h2>
        <p>Not Found</p>
        <a href='/' className="btn" >回到首页</a>
        <p>© 2016 anchengjian</p>
      </section>
    );
  }
});

module.exports = NotFound;