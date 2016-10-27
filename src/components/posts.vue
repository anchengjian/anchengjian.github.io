<template>
  <section class="container">
    <spinner :hide="!posts.content.length || !failedToLoad"></spinner>
    <article class="article-content" v-html="posts.content | marked"></article>
    <not-found v-if="failedToLoad">
      <p>没找到相关文章。</p>
    </notFound>
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
          // title: '',
          content: ''
        },
         failedToLoad: false
      };
    },
    props: ['postsList'],
    filters: {
      marked: marked
    },
    route: {
      data(transition) {
        let path = transition.to.path;
        if(!path.length) throw Error('路径不能为空');
        return fetch(path)
          .then((res) => {
            if (!res.ok || !res.statusText === 'OK') return '';
            return res.text();
          })
          .then((text) => {
            // 返回获取好的数据
            return {
              posts: {
                content: text
              },
              failedToLoad: !text.length
            }
          });
      }
    }
  };

</script>

<style lang="sass">
  pre{
    position: relative;
    code{
      display: block;
      margin: 0;
      padding: 60px 20px 20px;
      border-radius: 8px 8px 5px 5px;
      font-family: Monaco,Menlo,Consolas,Courier New,monospace;
      line-height: 1.4;
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
  .article-title, h1{
    text-align: center;
    font-size: 26px;
    font-weight: 700;
  }
  .article-content {
    border-radius: 5px;
    margin: 0 auto 20px;
    padding: 20px 0;
    background-color: #fff;
    width: auto;
    word-break: break-word;

    img {
      margin: 10px;
      box-shadow: 0px 4px 15px rgba(0, 0, 0, .1);
      max-width: 100%;
      transition: box-shadow .3s ease;
      &:hover {
        box-shadow: 0px 4px 15px rgba(0, 0, 0, .2);
      }
    }
  }
  @media (max-width: 768px){
    .article-content {
      font-size: 1em;
      line-height: 1.6em;
    }
  }
</style>