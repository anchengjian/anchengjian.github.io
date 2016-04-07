'use strict';

var React = require('react'),
    ReactRouter = require('react-router'),
    DateFormat=require('../../libs/dateFormat.js'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    Link = ReactRouter.Link,
    hashHistory = ReactRouter.hashHistory,
    items;

var ArticleList = React.createClass({
  getInitialState: function(){
    return this.props.dataIn;
  },
  componentWillReceiveProps: function(){
    items=this.props.dataIn.articles.map(function(ele,i){
      return (
        <li className='item'>
          <a href={'#/article/'+ele.name+'?path='+ele.path}>
            <span className='create-time'>{DateFormat('yyyy-MM-dd',ele.mtime)}</span>
            {ele.name}
          </a>
        </li>
      );
    });
  },
  render: function (){
    return (
      <ol className="articles">
        {items}
      </ol>
    );
  }
});

module.exports = ArticleList;