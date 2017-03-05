<template lang="pug">
  footer
    p {{copyRight}}
</template>
<script>
  export default {
    name: 'aFooter',
    props: ['copyRight']
  }
</script>
<style scoped>
  footer {
    padding: 15px 0;
    border-top: 1px solid #eee;
    text-align: center;
  }
</style>
