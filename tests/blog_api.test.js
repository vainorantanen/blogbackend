const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')

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

describe('Adding a blog:', () => {
  let token

  beforeEach(async () => {
    const user = {
      username: 'root',
      password: 'password'
    }

    const loginUser = await api
      .post('/api/login')
      .send(user)

    token = `bearer ${loginUser.body.token}`

    //console.log("TOKENI", token)
  })

  test('valid blog can be added to db', async () => {

    const newBlog = {
      title: 'Testailua',
      author: 'root',
      url: 'morovaan',
      likes: 11,
    }

    //console.log("Tokeni uudestaa", token)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(response => response.title)
    expect(contents).toContain('Test blog entry')
  })
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

describe('deletion of a blog', () => {
  test('there is -1 blogs and deleted content is gone', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    //console.log("BLOGIT: ", blogsAtStart)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('modifying an existing blog', () => {
  test('modified blog has updated amount of likes', async () => {
    const upBlog = {
      title: 'uusi blogi kakkonen',
      author : 'Korporaatio',
      url : 'randomurl/morotaas',
      likes: 11
    }
    const blogsAtStart = await helper.blogsInDb()
    const blogToChange = blogsAtStart[1]
    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(upBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    //console.log("put: ", blogsAtEnd)
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    expect(blogsAtEnd[1].likes).toBe(upBlog.likes)
    expect(blogsAtEnd[1].id).toBe(blogToChange.id)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is faulty', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Huonosalis',
      name: 'Superusermega',
      password: '',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password invalid')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'so',
      name: 'Superusermega',
      password: 'dkajdlad',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})