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

</style>
