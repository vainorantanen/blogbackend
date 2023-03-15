const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'uusi blogi',
    author : 'rauno',
    url : 'randomurl/morovaan',
    likes: 10
  },
  {
    title: 'uusi blogi kakkonen',
    author : 'Korporaatio',
    url : 'randomurl/morotaas',
    likes: 19
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  //console.log("BLOGS", blogs)
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}