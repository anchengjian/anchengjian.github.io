;(function(win, doc, undefinded){
  'use strict';

  var React = require('react'),
      ReactRouter = require('react-router'),
      common = require('./components/common'),
      Header = require('./components/header'),
      ArticleList = require('./components/articleList'),
      Article = require('./components/article'),
      NoMatch = require('./components/404'),
      Router = ReactRouter.Router,
      Route = ReactRouter.Route,
      Link = ReactRouter.Link,
      hashHistory = ReactRouter.hashHistory,
      articles=null;

var app = React.createClass({
    getInitialState: function(){
      return this.state={};
    },
    componentDidMount: function(){
      common.ajax({
        url: './articles/list.json',
        type: 'get',
        data: {},
        success: function(res){
          articles=res;
          this.state.articles=res;
          if (this.isMounted()) this.setState(this.state);
        }.bind(this)
      });
    },
    render: function (){
      return (
        <main className='container'>
          <Header />
          <ArticleList dataIn={this.state} />
        </main>
      );
    }
  });


  React.render((
    <Router history={hashHistory}>
      <Route path="/" component={app} />
      <Route path="/article/:id" component={Article} dataIn={articles}/>
      <Route path="*" component={NoMatch}/>
    </Router>
  ), doc.body);

})(window, document);