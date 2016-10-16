<template>
  <header class="header-warp">
    <section class="container header-content">
      <img :src="user.headurl" class="avatar" alt="{{user.name}}">
      <h2 class="name">{{user.name}}</h2>
      <h3 class="title">{{user.job}}</h3>

      <nav class="main-nav">
        <a v-link="{ path: '/' }" class="btn-link">首页</a>
        <a href="/animation-demos/" class="btn-link">动效实验</a>
        <a href="https://github.com/anchengjian/anchengjian.github.io" class="btn-link">View on GitHub</a>
        <!-- <a v-link="{ path: '/about' }" class="btn-link">关于</a> -->
      </nav>
    </section>
  </header>
</template>

<script>
  export default {
    props: ['user']
  };
</script>

<style lang="sass">
  .header-warp{
    position: relative;
    z-index: 1;
    padding: 40px 0 20px;
    background-color: #fff;
    text-align: center;

    .header-content{
      z-index: 10;
    }
    .name{
      display: inline-block;
      font-weight: 400;
      letter-spacing: 0;
      font-size: 20px;
      color: #222;
    }
    .title{
      font-size: 14px;
      font-weight: 300;
      color: #aaa;
    }
    .avatar{
      display: block;
      width: 80px;
      height: 80px;
      margin: 0 auto 15px;
      border-radius: 50%;
    }
    .main-nav{
      position: absolute;
      top: 10px;
      right: 50px;
    }
    .btn-link {
      margin: 0;
      padding: 4px 8px;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all ease .2s;
      &:hover {
        border-color: #5694f1;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .header-warp {
      .main-nav {
        position: inherit;
        top: inherit;
        right: inherit;
        margin-top: 10px;
      }
    }
  }
</style>