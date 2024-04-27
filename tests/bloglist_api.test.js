const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const initialBlogs = require('./blogLists').blogs.slice(0, 2)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
})

test('blogs have identifier called id', async () => {
    const response = await api.get('/api/blogs')
    assert(Object.hasOwn(response.body[0], 'id'))
})

test('adding a blog succeeds', async () => {
    const newBlog = {
        author: 'Robert C. Martin',
        title: 'First class tests',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const blogs = await api.get('/api/blogs')
    const contents = blogs.body.map(b => b.title)

    assert.strictEqual(blogs.body.length, initialBlogs.length + 1)
    assert(contents.includes('First class tests'))
})

test('new blog without likes gets zero likes', async () => {
    const newBlog = {
        author: 'Robert C. Martin',
        title: 'First class tests',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
    }

    const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)

    assert.strictEqual(savedBlog.body.likes, 0)
})

test('cannot add new blog without title', async () => {
    const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(404)
})

test('cannot add new blog without url', async () => {
    const newBlog = {
        author: 'Robert C. Martin',
        title: 'First class tests',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(404)
})

test('a blog can be deleted', async () => {
    const blogToDelete = (await api.get('/api/blogs')).body[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogs = await api.get('/api/blogs')
    const contents = blogs.body.map(b => b.title)

    assert.strictEqual(blogs.body.length, initialBlogs.length - 1)
    assert(!(contents.includes('React patterns')))
})

/* test('the number of likes can be updated', async () => {
    const blogToUpdate = (await api.get('/api/blogs')).body[0]
    console.log(blogToUpdate.id)
    const update = { 
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 8 
    }
    const updatedBlog = await api.put(`/api/blogs/${blogToUpdate.id}`).send(update)
    assert.strictEqual(updatedBlog.body.likes, 8)
}) */

after(async () => {
    await mongoose.connection.close()
})