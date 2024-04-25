const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (total, blog) => {
        return total + blog.likes
    }
    
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (maxLikes, blog) => {
        return blog.likes > maxLikes ? blog.likes : maxLikes
    }
    
    const maxLikes = blogs.reduce(reducer, 0)
    const favorites = blogs.filter(blog => blog.likes === maxLikes)
    const result = {
        title: '',
        author: '',
        likes: 0
    }

    if (favorites.length > 0) {
        const favorite = favorites[0]
        result.title = favorite.title
        result.author = favorite.author
        result.likes = favorite.likes
    }
    
    return result
}

const maxReducer = (maxItem, item) => {
    return item[1] > maxItem[1] ? item : maxItem
}

const getMaxAuthor = (authors, counts) => {
    const authorsWithCounts = lodash.zip(authors, counts)
    const maxAuthor = authorsWithCounts.reduce(maxReducer, ['', 0])
    return maxAuthor
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = lodash.countBy(blogs, (blog) => blog.author)
    const maxAuthor = getMaxAuthor(
        Object.keys(blogsByAuthor),
        Object.values(blogsByAuthor)
    )

    return {
        author: maxAuthor[0],
        blogs: maxAuthor[1]
    }
}

const mostLikes = (blogs) => {
    const blogsByAuthor = lodash.groupBy(blogs, (blog) => blog.author)
    const likeCounts = Object.values(blogsByAuthor).map(
        blogs => blogs.reduce(
            (sum, blog) => sum + blog.likes,
            0
        )
    )
    const maxAuthor = getMaxAuthor(
        Object.keys(blogsByAuthor),
        likeCounts
    )

    return {
        author: maxAuthor[0],
        likes: maxAuthor[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
