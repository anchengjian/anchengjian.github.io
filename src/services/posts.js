import xhr from '@/services/xhr'

class PostsService {
  static postList = null
  static fetchPostList = null
  getList() {
    if (this.postList) return new Promise((resolve, reject) => resolve(this.postList))
    if (this.fetchPostList) return this.fetchPostList
    this.fetchPostList = xhr('/posts/list.json')
    return this.fetchPostList
  }

  getPosts(path) {
    return xhr(path, {})
  }
}

export default new PostsService()
