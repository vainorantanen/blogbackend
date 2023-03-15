const listHelper = require('../utils/list_helper')

const listWithMultipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const zeroBlogs = []

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const res = listHelper.totalLikes(listWithMultipleBlogs)
    expect(res).toBe(36)
  })

  test('of empty list is zero', () => {
    const res = listHelper.totalLikes(zeroBlogs)
    expect(res).toBe(0)
  })

})

describe('finds favorite blog', () => {
  test('finds the right favorite blog', () => {
    const favblog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    const res = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(res).toEqual(favblog)
  })
})

describe('most blogs by author', () => {
  test('finds the author with most blogs', () => {
    const mostBlogsAuthor = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    const res = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(res).toEqual(mostBlogsAuthor)
  })
})

describe('author with most likes', () => {
  test('finds the author with most likes', () => {
    const mostlikedAuthor = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    const res = listHelper.mostLikes(listWithMultipleBlogs)
    expect(res).toEqual(mostlikedAuthor)
  })
})