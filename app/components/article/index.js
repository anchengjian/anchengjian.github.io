'use strict';

var React = require('react'),
    style = require('./style.less'),
    common = require('../common'),
    markdown = require('../../libs/Markdown.Converter.js'),
    article = {
      title:null,
      description:null
    };

function createMarkup() { return {__html: article.description}; };

var ArticleBox = React.createClass({
  getInitialState: function(){
    return this.props;
  },
  componentDidMount: function(){
    console.log(this.props);
    var search=common.getQueryParams(this.props.location.search);
    common.ajax({
      url: search.path+this.props.params.id,
      type: 'get',
      data: {},
      success: function(res){
        article.title=this.props.params.id;
        article.description=new markdown.Converter().makeHtml(res);
        this.setState(article);
      }.bind(this)
    });
  },
  render: function (){
    return (
      <article>
        <h2>{article.title}</h2>
        <div className='content' dangerouslySetInnerHTML={createMarkup()} />
      </article>
    );
  }
});

module.exports = ArticleBox;