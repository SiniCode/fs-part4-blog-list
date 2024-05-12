const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const getToken = async () => {
    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'pooh', password: 'honeyjar00'})

    const token = loginResponse.body.token
    return `Bearer ${token}`
}

describe('when there are initially two blogs and one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
    
        const user = new User({
            _id: "6633ba7d57a4cd4b5b4cee7a",
            username: "pooh",
            name: "Winnie Pooh",
            passwordHash: "$2b$10$Ob7AKh0L2EJOWCaACgDlmeFSHTc4Vr/S.d/HkhYH2HCLsSpR4dH9C",
            blogs:["6633c136c503da7056623e02", "6633c1d7c503da7056623e06"],
            __v: 0
        })
    
        await user.save()
    
        const blog1 = new Blog({
            title: "Kinuskikissa",
            author: "Kinuskikissa",
            url: "https://www.kinuskikissa.fi/",
            likes: 22,
            user: "6633ba7d57a4cd4b5b4cee7a",
            __v: 0,
            _id: "6633c136c503da7056623e02"
        })
    
        const blog2 = new Blog({
            title: "Suklaapossu",
            author: "Suklaapossu",
            url: "https://suklaapossu.blogspot.com/",
            likes: 9,
            user: "6633ba7d57a4cd4b5b4cee7a",
            __v: 0,
            _id: "6633c1d7c503da7056623e06"
        })
    
        await Blog.insertMany([blog1, blog2])
    })

    test('there is one user', async () => {
        const users = await helper.usersInDb()
        assert.strictEqual(users.length, 1)
    })
    
    test('there are two blogs', async () => {
        const response = await api
            .get('/api/blogs')
    
        assert.strictEqual(response.body.length, 2)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect('Content-Type', /application\/json/)
    })

    test('blogs have identifier called id', async () => {
        const response = await api
            .get('/api/blogs')
        assert(Object.hasOwn(response.body[0], 'id'))
    })

    test('adding a blog succeeds with complete information', async () => {
        const token = await getToken()
        const newBlog = {
            author: 'Robert C. Martin',
            title: 'First class tests',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(201)

        const blogs = await helper.blogsInDb()
        const contents = blogs.map(b => b.title)

        assert.strictEqual(blogs.length, 3)
        assert(contents.includes('First class tests'))
    })

    test('new blog gets zero likes if no likes are given', async () => {
        const token = await getToken()
        const newBlog = {
            author: 'Robert C. Martin',
            title: 'First class tests',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
        }
        
        const savedBlog = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
        
        assert.strictEqual(savedBlog.body.likes, 0)
    })

    test('adding a blog fails if no title is given', async () => {
        const token = await getToken()
        const newBlog = {
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 10
        }
        
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(400)

        const blogs = await helper.blogsInDb()
        assert.strictEqual(blogs.length, 2)
    })

    test('adding a blog fails without url', async () => {
        const token = await getToken()
        const newBlog = {
            author: 'Robert C. Martin',
            title: 'First class tests',
            likes: 10
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(400)

        const blogs = await helper.blogsInDb()
        assert.strictEqual(blogs.length, 2)
    })

    test('blog can be deleted with correct token', async () => {
        const token = await getToken()
    
        await api
            .delete('/api/blogs/6633c1d7c503da7056623e06')
            .set('Authorization', token)
            .expect(204)
    
        const blogs = await helper.blogsInDb()
        const contents = blogs.map(b => b.title)
    
        assert.strictEqual(blogs.length, 1)
        assert(!(contents.includes('Suklaapossu')))
    })

    test ('the number of likes can be updated', async () => {
        const update = { likes: 10 }
        const updatedBlog = await api
            .put('/api/blogs/6633c1d7c503da7056623e06')
            .send(update)

        assert.strictEqual(updatedBlog.body.likes, 10) 
    })

    describe('creating new user', () => {
        test('succeeds with unique username', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'robin',
                name: 'Cristopher Robin',
                password: 'HundredAcreWood'
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)
    
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
            const usernames = usersAtEnd.map(u => u.username)
            assert(usernames.includes(newUser.username))
        })
    
        test('fails if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()
        
            const newUser = {
                username: 'pooh',
                name: 'Edward Bear',
                password: 'ilovehoney'
            }
        
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)
        
            const usersAtEnd = await helper.usersInDb()
            assert(result.body.error.includes('expected `username` to be unique'))
        
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    
        test('fails if username is too short', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'P',
                name: 'Piglet',
                password: 'scaredofhackers'
            }
    
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
    
            const usersAtEnd = await helper.usersInDb()
    
            assert(result.body.error.includes('User validation failed: username'))
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    
        test('fails with too short password', async () => {
            const usersAtStart = await helper.usersInDb()
    
            const newUser = {
                username: 'Piggy',
                name: 'Piglet',
                password: 'OO'
            }
    
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
    
            const usersAtEnd = await helper.usersInDb()
    
            assert(result.body.error.includes('minimum length for password is 3'))
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})