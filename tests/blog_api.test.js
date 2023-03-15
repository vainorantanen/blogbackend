const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns the right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the returned blogs have identifier id', async () => {
  const response = await api.get('/api/blogs')
  //console.log("R", response.body.map(b => b.id))
  expect(response.body.map(b => b.id)).toBeDefined()
})

test('valid blogs can be added', async () => {
  const postBlog = {
    title: 'postBlog',
    author : 'Postia',
    url : 'postimies/morovaan',
    likes: 12
  }
  await api
    .post('/api/blogs')
    .send(postBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length +1)
  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain(
    'postBlog'
  )
})

test('likes is set to 0 if not given a value', async () => {
  const postBlog = {
    title: 'postBlog',
    author : 'Postia',
    url : 'postimies/morovaan',
  }

  await api
    .post('/api/blogs')
    .send(postBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  //console.log("BLOGS", blogsAtEnd)
  let addedBlog = {}
  for (let i = 0; i < blogsAtEnd.length; i++) {
    if (blogsAtEnd[i].title === postBlog.title) {
      addedBlog.title = postBlog.title
      addedBlog.author = postBlog.author
      addedBlog.url = postBlog.url
      addedBlog.likes = blogsAtEnd[i].likes
    }
  }
  //console.log("ADDED", addedBlog)
  expect(addedBlog.likes).toBe(0)
})

test('if blog doesnt contain title, status code 400 is revieced', async () => {
  const postBlog = {
    author : 'Postia',
    url : 'postimies/morovaan',
    likes: 12
  }
  await api
    .post('/api/blogs')
    .send(postBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  //const blogsAtEnd = await helper.blogsInDb()
})

test('if blog doesnt contain url, status code 400 is revieced', async () => {
  const postBlog = {
    title: 'postBlog',
    author : 'Postia',
    likes: 12
  }
  await api
    .post('/api/blogs')
    .send(postBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  //const blogsAtEnd = await helper.blogsInDb()
})

afterAll(async () => {
  await mongoose.connection.close()
})