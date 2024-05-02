const Blog = require('../models/blog')
const User = require('../models/user')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { usersInDb, blogsInDb }
