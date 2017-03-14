<template lang="pug">
  section.text-center.not-found-container
    h2.not-found 404!
    slot
      p 来到一片没人的荒漠
</template>
<script>
  export default {
    name: 'notFound'
  }
</script>
<style scoped>
  .not-found-container {
    padding: 50px 0;
  }
  
  .not-found {
    font-size: 200px;
    margin: 0;
    padding: 0;
    color: #ddd;
    font-family: fantasy;
    line-height: 1;
  }
</style>
