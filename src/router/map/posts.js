const postsArticle = r => require.ensure([], () => r(require('@/views/posts')), 'posts')

export default {
  name: 'Posts',
  path: '/posts/*',
  component: postsArticle
}
