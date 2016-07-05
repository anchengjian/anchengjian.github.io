import assets from './assets/index.js';

import app from './components/app.vue';
import header from './components/header.vue';
import footer from './components/footer.vue';
import postsList from './components/posts-list.vue';
import article from './components/article.vue';

Vue.component('app', app);
Vue.component('my-header', header);
Vue.component('my-footer', footer);
Vue.component('posts-list', postsList);
Vue.component('my-article', article);

import dateFilter from './filters/date.filter.js';
Vue.filter('date', dateFilter);

let App = Vue.extend({});
Vue.use(VueRouter);
let router = new VueRouter();

router.map({
  '/': {
    component: (resolve) => {
      resolve(postsList);
    }
  },
  '/article/:title': {
    component: (resolve) => {
      resolve(article);
    }
  }
});

router.start(App, 'body');
