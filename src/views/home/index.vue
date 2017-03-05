<template lang="pug">
  section.container.post-container
    spinner(v-if="loading")
    err(v-if="!postsList.length && !loading")
    ul.posts-list
      li.card(v-for="item in postsList")
        router-link.item-link(:to="{path: item.path}")
          h2.title {{item.name}}
          p.summary {{item.summary}}
          span.dates {{item.birthtime | date}}
</template>
<script>
  import postsService from '@/services/posts'

  export default {
    name: 'home',
    data() {
      return {
        loading: true,
        postsList: []
      }
    },
    created() {
      postsService.getList()
        .then(list => {
          this.postsList = list
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    }
  }
</script>
<style scoped>
  .post-container {
    padding: 100px 0;
    text-align: center;
  }
  
  .posts-list {
    list-style: none;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
  }
  
  .card {
    position: relative;
    padding: 20px 0;
    border-top: 1px solid #eee;
    text-align: left;
  }
  
  .card:hover .dates,
  .card:hover .title {
    transition: color ease-in-out .3s;
    color: #5694f1;
  }
  
  .item-link {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0 10px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.8;
    color: #2b2b2b;
  }
  
  .summary {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #aaa;
    word-break: break-all;
  }

  .dates {
    position: absolute;
    right: 0;
    top: 20px;
    font-size: 16px;
    font-weight: 300;
    line-height: 32px;
    color: #bbb;
  }
</style>
