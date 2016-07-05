<template>
  <my-header :user="user"></my-header>
  <router-view :articles="articles"></router-view>
  <my-footer :user="user"></my-footer>
</template>

<script>

  import userinfo from '../userinfo.js';

  let globalData = {
    user: userinfo,
    articles: null
  };

  // TODO：兼容性等问题，不做考虑
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
  fetch('/articles/list.json')
    .then((res)=>{
      return res.json();
    })
    .then((json) => {
      return globalData.articles = json;
    })
    .catch((ex) => {
      return console.error('parsing failed', ex);
    });

  export default {
    data(){
      return globalData;
    }
  };
</script>

<style lang="sass">
  .card{
    display: block;
  }
</style>