<template>
  <section class="container">
    <spinner :show="!postsList"></spinner>
    <ul class="posts-list">
      <li v-for="item in postsList" class="card">
        <a v-link="{path: item.path}">
          <h2>{{item.name}}</h2>
          <p>{{item.summary}}</p>
          <span class="dates">{{item.birthtime | date}}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script>
  export default {
    props: ['postsList']
  };
</script>

<style lang="sass">
  .posts-list{
    list-style: none;

    .card{
      position: relative;
      padding: 20px 0;
      border-top: 1px solid #eee;

      &:last-of-type {
        border-bottom: 1px solid #eee;
      }

      &:hover{
        .dates, h2{
          transition: color ease-in-out .3s;
          color: #5694f1;
        }
      }

      a{
        display: block;
        width: 100%;
        height: 100%;
        padding: 0 10px;
      }
      h2{
        font-size: 18px;
        font-weight: 700;
        line-height: 1.8;
        color: #2b2b2b;
      }
      p{
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        color: #aaa;
      }
    }

    .dates{
      position: absolute;
      top: 22px;
      right: 10px;
      font-size: 16px;
      font-weight: 300;
      line-height: 1.6;
      color: #bbb;
    }
  }
</style>