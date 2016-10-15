<template>
  <my-header :user="user"></my-header>
  <router-view :posts-list="postsList"></router-view>
  <my-footer :user="user"></my-footer>
</template>

<script>
  import config from '../../config/blog.config.js';
  let globalData = {
    user: config,
    postsList: null
  };

  // TODO：兼容性等问题，不做考虑
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
  fetch(config.listPath || './posts/list.json')
    .then((res)=>{
      return res.json();
    })
    .then((json) => {
      return globalData.postsList = json;
    })
    .catch((ex) => {
      return console.error('parsing failed', ex);
    });

  export default {
    data(){
      return globalData;
    },
    replace: false
  };
</script>

<style lang="sass">
  .card{
    display: block;
  }
</style>