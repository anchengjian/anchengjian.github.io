<template lang="pug">
  header.header-warp
    section.container.header-content
      img.avatar(:src="headurl", :alt="name")
      h2.name {{name}}
      h3.title {{job}}
      nav.header-nav
        router-link.btn-link(to="/") 首页
        a.btn-link(href="https://github.com/anchengjian/anchengjian.github.io") View on GitHub
</template>
<script>
  export default {
    name: 'aHeader',
    props: ['headurl', 'name', 'job']
  }
</script>
<style scoped>
  .header-warp {
    position: relative;
    z-index: 1;
    padding: 40px 0 20px;
    background-color: #fff;
    text-align: center;
  }
  
  .header-content {
    z-index: 10;
  }
  
  .name {
    display: inline-block;
    font-weight: 400;
    letter-spacing: 0;
    font-size: 20px;
    color: #222;
  }
  
  .title {
    font-size: 14px;
    font-weight: 300;
    color: #aaa;
  }
  
  .avatar {
    display: block;
    width: 80px;
    height: 80px;
    margin: 0 auto 15px;
    border-radius: 50%;
  }
  
  .header-nav {
    position: absolute;
    top: 10px;
    right: 50px;
  }
  
  .btn-link {
    margin: 0 5px;
    padding: 4px 8px;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all ease .2s;
    &:hover {
      border-color: #5694f1;
    }
  }
  
  @media screen and (max-width: 750px) {
    .header-nav {
      position: inherit;
      top: inherit;
      right: inherit;
      margin-top: 10px;
    }
  }
</style>
