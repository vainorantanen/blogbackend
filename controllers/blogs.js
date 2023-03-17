const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor } = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user

  //console.log("user: ", user)

  if (!user) {
    return response.status(401).json({ error: 'token is missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const userWithToken = request.user
  const blog = await Blog.findById(request.params.id)
  /*
  console.log("user", userWithToken)
  console.log("blog", blog)
  console.log("blog.user", blog.user.toString())
  console.log("userWithToken", userWithToken._id.toString())
  */
  if ( blog.user.toString() === userWithToken._id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'user not authored to delete this' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updBlogi = await Blog.findByIdAndUpdate(request.params.id, blog, { new : true })
  response.json(updBlogi)
})

module.exports = blogsRouter