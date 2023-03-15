const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  for (let i = 0; i < blogs.length; i++) {
    sum += blogs[i].likes
  }
  return sum
}

const favoriteBlog = (blogs) => {
  let fav = {
    title: '',
    author: '',
    likes: 0
  }
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > fav.likes) {
      fav.title = blogs[i].title
      fav.author = blogs[i].author
      fav.likes = blogs[i].likes
    }
  }
  return fav
}

const mostBlogs = (blogs) => {
  const authors = []
  for (let i = 0; i < blogs.length; i++) {
    authors.push(blogs[i].author)
  }

  // valmis lista jossa kaikki authorit
  const indAuth = []
  for (let j = 0; j < authors.length; j++) {
    if (!indAuth.includes(authors[j])) {
      indAuth.push(authors[j])
    }
  }
  // toimii! console.log(indAuth)
  // indAuth = [ 'Michael Chan', 'Edsger W. Dijkstra', 'Robert C. Martin' ]
  const finalAuth = []
  for (let k = 0; k < indAuth.length; k++) {
    const obj = {
      author: indAuth[k],
      blogs: 0,
    }
    for (let b = 0; b < blogs.length; b++) {
      if (blogs[b].author === obj.author) {
        obj.blogs +=1
      }
    }
    finalAuth.push(obj)
  }
  //console.log(finalAuth)
  let res = finalAuth[0]
  for (let y = 1; y < finalAuth.length; y++) {
    if (finalAuth[y].blogs > res.blogs) {
      res = finalAuth[y]
    }
  }
  return res

}

const mostLikes = (blogs) => {
  const authors = []
  for (let i = 0; i < blogs.length; i++) {
    authors.push(blogs[i].author)
  }

  // valmis lista jossa kaikki authorit
  const indAuth = []
  for (let j = 0; j < authors.length; j++) {
    if (!indAuth.includes(authors[j])) {
      indAuth.push(authors[j])
    }
  }
  //[ 'Michael Chan', 'Edsger W. Dijkstra', 'Robert C. Martin' ]

  const finalAuth = []
  for (let k = 0; k < indAuth.length; k++) {
    const obj = {
      author: indAuth[k],
      likes: 0,
    }
    for (let b = 0; b < blogs.length; b++) {
      if (blogs[b].author === obj.author) {
        obj.likes += blogs[b].likes
      }
    }
    finalAuth.push(obj)
  }

  let res = finalAuth[0]
  for (let y = 1; y < finalAuth.length; y++) {
    if (finalAuth[y].likes > res.likes) {
      res = finalAuth[y]
    }
  }
  return res
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
  favoriteBlog
}