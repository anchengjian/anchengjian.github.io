const homeTpl = r => require.ensure([], () => r(require('@/views/home')), 'home')

export default {
  name: 'Home',
  path: '/',
  component: homeTpl
}
