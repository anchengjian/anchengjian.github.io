import assets from './assets/index.js';

import Vue from 'vue';
import VueRouter from 'vue-router';

import app from './components/app.vue';
import header from './components/header.vue';
import footer from './components/footer.vue';
import postsList from './components/posts-list.vue';
import posts from './components/posts.vue';
import spinner from './components/spinner.vue';
import notFound from './components/notFound.vue';

Vue.component('app', app);
Vue.component('my-header', header);
Vue.component('my-footer', footer);
Vue.component('posts-list', postsList);
Vue.component('my-posts', posts);
Vue.component('spinner', spinner);
Vue.component('notFound', notFound);

import dateFilter from './filters/date.filter.js';
Vue.filter('date', dateFilter);

Vue.use(VueRouter);
let router = new VueRouter({});

let routerMap = {
  '/': {
    component: (resolve) => {
      resolve(postsList);
    }
  }
};

import config from '../config/blog.config.js';
let postsPath = ((config.rootPath.substr(-1) === '/' ? config.rootPath : config.rootPath + '/') || '/posts/') + '*any';
routerMap[postsPath] = {
  component: (resolve) => {
    resolve(posts);
  }
};

router.map(routerMap);
router.start(app, 'body');
