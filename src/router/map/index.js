// 不同功能模块的路由应代码分离
import homeRoutes from './home'
import postsRoutes from './posts'

let notFoundRoutes = {
  name: 'NotFound',
  path: '*',
  meta: {
    requiresAuth: false
  },
  component: require('@/views/notFound')
}

export default [
  homeRoutes,
  postsRoutes,
  notFoundRoutes
]
