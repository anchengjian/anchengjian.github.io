import Vue from 'vue'
import Router from 'vue-router'

import routesMap from './map'

Vue.use(Router)

const router = new Router({
  mode: 'hash', // pure browser, so required!
  linkActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: routesMap
})

export default router
