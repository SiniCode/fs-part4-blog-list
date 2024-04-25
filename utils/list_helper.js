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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
