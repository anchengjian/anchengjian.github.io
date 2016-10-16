<template>
  <section class="container text-center">
    <h2 class="not-found">404</h2>
    <slot></slot>
  </section>
</template>

<script>
  export default {
    props: []
  };
</script>

<style lang="sass">
  .not-found {
    font-size: 200px;
    margin: 0;
    padding: 0;
    color: #ddd;
    font-family: fantasy;
    line-height: 1;
  }
</style>