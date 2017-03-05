<template lang="pug">
  section
    span.info-icon !
    slot
      span 暂未获取到相关数据
</template>
<script>
  export default {
    name: 'err'
  }
</script>
<style scoped>
  .info-icon {
    color: #999;
    display: inline-block;
    margin-right: 10px;
    width: 22px;
    height: 22px;
    font-size: 12px;
    font-weight: 600;
    line-height: 22px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
  }
</style>
