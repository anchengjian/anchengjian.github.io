<template>
  <footer class="footer-warp">
    <section class="container">
      <p class="copyright">© Copyright 2016 {{user.name}}</p>
    </section>
  </footer>
</template>

<script>
  export default {
    props: ['user']
  };
</script>

<style lang="sass">
  .footer-warp{
    width: 100%;
    padding: 20px;

    .copyright{
      text-align: center;
      font-size: 12px;
      line-height: 1.5;
    }
  }
</style>