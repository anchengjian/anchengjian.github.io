<template>
  <div class="spinner components-spinner" v-show="show" >
    <div class="bounce"></div>
    <div class="bounce"></div>
    <div class="bounce"></div>
  </div>
</template>

<style lang="sass">
  .spinner {
    margin: 0 auto;
    width: 150px;
    text-align: center;
    &.page-spinner {
      margin-top: 100px;
    }
    &.components-spinner{
      margin-top: 150px;
      margin-bottom: 150px;
    }
    >.bounce {
      width: 30px;
      height: 30px;
      background-color: rgba(91, 173, 240, 0.6);
      border-radius: 100%;
      display: inline-block;
      animation: bouncedelay 1.4s infinite ease-in-out;
      /* Prevent first frame from flickering when animation starts */
      animation-fill-mode: both;
      &:nth-of-type(1) {
        animation-delay: -0.32s;
      }
      &:nth-of-type(2) {
        animation-delay: -0.16s;
      }
    }
  }

  @keyframes bouncedelay {
    0%, 80%, 100% {
      transform: scale(0.0);
    }
    40% {
      transform: scale(1.0);
    }
  }
</style>

<script>
  export default {
    props: ['show']
  };
</script>
