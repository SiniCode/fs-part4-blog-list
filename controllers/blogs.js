const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(request.user)

    if (!(body.title && body.url)) {
        return response.status(404).end()
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

    response
        .status(201)
        .json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== request.user.toString()) {
        return response.status(401).json({ error: 'Unauthorized operation' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const oldBlog = await Blog.findById(request.params.id)
    if (oldBlog.user.toString() !== request.user.toString()) {
        return response.status(401).json({ error: 'Unauthorized operation' })
    }

    const body = request.body

    const blog = {
        title: body.title || oldBlog.title,
        author: body.author || oldBlog.author,
        url: body.url || oldBlog.url,
        likes: body.likes || oldBlog.likes,
        user: oldBlog.user
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter
