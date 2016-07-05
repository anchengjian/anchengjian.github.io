<template>
  <section class="container">
    <h1 class="post-title">{{posts.title}}</h1>
    <article class="post" v-html="posts.content | marked"></article>
  </section>
</template>

<script>
  import marked from 'marked';
  import hljs from 'highlight.js';

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code, lang, callback) {
      return hljs.highlightAuto(code).value;
    }
  });

  export default {
    data() {
      return {
        posts: {
          title: '',
          content: ''
        }
      };
    },
    props: ['articles'],
    filters: {
      marked: marked
    },
    methods:{
      allRight: function(htmlStr){
        console.log('渲染完成了');
      }
    },
    route: {
      data(transition) {
        let title = transition.to.params.title;

        return new Promise((resolve, reject) =>{

          let articles = this.$get('articles');

          let i = 0;
          if(!articles){
            let t = setInterval(()=>{

              articles = this.$get('articles');

              // 成功获取了数据
              if (articles){
                clearInterval(t);
                resolve(articles);
              }

              // 超时
              if(i > 2000){
                clearInterval(t);
                reject('列表信息获取错误');
              }

              i++;

            }, 10);
          }else{
            resolve(articles);
          }

        })
        .then((articles) => {

          let info = articles.filter((ele) => { return (title === ele.name); });
          if(info.length < 1) return console.error('没找到数据哦');
          if(info.length > 1) return console.warn('同名文章警告');

          // 同名文章只取第一章
          return getPosts(title, info[0].path)
                  .then((data)=>{

                    // 返回获取好的数据
                    return {
                      posts: {
                        title: title,
                        content: data
                      }
                    }

                  });
        })
        .catch((ex) => {
          return console.error('获取文章数据出错：', ex);
        });

      }
    }
  };

  function getPosts (title, path) {

    if (!title || !path) return;

    return fetch(path + title)
      .then((res)=>{
        return res.text();
      })
      .then((text) => {
        return text;
      })
      .catch((ex) => {
        return console.error('parsing failed', ex);
      });
  }

</script>

<style lang="sass">
  pre{
    position: relative;
    code{
      display: block;
      padding: 60px 20px 20px;
      border-radius: 8px 8px 5px 5px;
      font-family: Monaco,Menlo,Consolas,Courier New,monospace;
      background-color: rgb(39,40,34);
      color: #ccc;
      overflow-x: auto;
      &::before{
        content: attr(class);
        color: #fff;
        height: 38px;
        line-height: 38px;
        font-size: 16px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-radius: 5px 5px 0 0;
        background-image: linear-gradient(#e8e7e8,#d3d2d3);
        font-family: 'Source Sans Pro',sans-serif;
        font-weight: 700;
        text-indent: 95px;
      }
      &::after{
        content: " ";
        position: absolute;
        border-radius: 50%;
        background: #fc625d;
        width: 12px;
        height: 12px;
        top: 0;
        left: 20px;
        margin-top: 13px;
        box-shadow: 20px 0 #fdbc40,40px 0 #35cd4b;
      }
    }
  }
  .post-title{
    text-align: center;
    font-size: 26px;
    font-weight: 700;
  }
  .post {
    border-radius: 5px;
    margin: 0 auto 20px;
    padding: 20px 0;
    background-color: #fff;
    width: auto;
    word-break: break-word;
  }
  @media (max-width: 768px){
    .post {
      font-size: 1em;
      line-height: 1.6em;
    }
  }
</style>