'use strict';

var React = require('react'),
    highlightCss = require('../../libs/agate.min.css'),
    common = require('../common'),
    marked = require('marked'),
    article = {
      title:null,
      description:null
    };

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return require('../../libs/highlight.min.js').highlightAuto(code).value;
  }
});

function createMarkup() { return {__html: article.description}; };

var ArticleBox = React.createClass({
  getInitialState: function(){
    return this.props;
  },
  componentDidMount: function(){
    var search=common.getQueryParams(this.props.location.search);
    common.ajax({
      url: search.path+this.props.params.id,
      type: 'get',
      data: {},
      success: function(res){
        article.title=this.props.params.id;
        article.description=marked(res);
        this.setState(article);
      }.bind(this)
    });
  },
  render: function (){
    return (
      <article>
      <div className='content' dangerouslySetInnerHTML={createMarkup()} />
      </article>
    );
  }
});

module.exports = ArticleBox;