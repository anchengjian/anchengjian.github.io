<template lang="pug">
  .full-body
    a-header(:headurl="appInfo.headurl", :name="appInfo.name", :job="appInfo.job")
    router-view
    a-footer(:copy-right="appInfo.copyRight")
</template>
<script>
  import { appInfo } from 'config/app'
  export default {
    name: 'app',
    data() {
      return {
        appInfo
      }
    }
  }
</script>
<style src="./assets/css/style.css"></style>
<style>
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: transparent;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  /*定义滑块 内阴影+圆角*/
  
  ::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background-color: #e3efed;
  }
  
  .hover-scroll {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: #e3efed;
      }
    }
  }
</style>
