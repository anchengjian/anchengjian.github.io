<template lang="pug">
  section.container
    spinner(v-if="loading")
    err(v-if="!content && !loading")
    article.article-container(v-html="compiledMarkdown")    
</template>
<script>
  import postsService from '@/services/posts'

  import marked from 'marked'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/monokai-sublime.css'
  const markedOptions = {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function(code, lang, callback) {
      return hljs.highlightAuto(code).value
    }
  }

  export default {
    name: 'posts',
    data() {
      return {
        loading: true,
        content: ''
      }
    },
    computed: {
      compiledMarkdown() {
        if (!this.content) return ''
        return marked(this.content, markedOptions)
      }
    },
    created() {
      let path = this.$route.path
      postsService.getPosts(path)
        .then(res => {
          this.content = res
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })

      document.body.scrollTop = 0
    }
  }
</script>
<style>
  pre {
    position: relative;
  }
  
  pre code {
    display: block;
    margin: 0;
    padding: 60px 20px 20px;
    border-radius: 8px 8px 5px 5px;
    font-family: Monaco, Menlo, Consolas, Courier New, monospace;
    line-height: 1.4;
    background-color: rgb(39, 40, 34);
    color: #ccc;
    overflow-x: auto;
    &::before {
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
      background-image: linear-gradient(#e8e7e8, #d3d2d3);
      font-family: 'Source Sans Pro', sans-serif;
      font-weight: 700;
      text-indent: 95px;
    }
    &::after {
      content: " ";
      position: absolute;
      border-radius: 50%;
      background: #fc625d;
      width: 12px;
      height: 12px;
      top: 0;
      left: 20px;
      margin-top: 13px;
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    }
  }
  
  .article-title,
  h1 {
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    line-height: 2;
    margin-bottom: 2em;
  }
  
  .article-container {
    border-radius: 5px;
    padding: 50px 0;
    background-color: #fff;
    width: auto;
    word-break: break-word;
  }
  
  .article-container img {
    margin: 10px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, .1);
    max-width: 100%;
    transition: box-shadow .3s ease;
    &:hover {
      box-shadow: 0px 4px 15px rgba(0, 0, 0, .2);
    }
  }
  
  @media (max-width: 768px) {
    .article-container {
      font-size: 1em;
      line-height: 1.6em;
    }
  }
</style>
