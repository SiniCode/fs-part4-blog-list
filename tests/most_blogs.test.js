const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs
const blogLists = require('./blogLists')

describe('mostBlogs', () => {
    test('of empty list returns empty author with zero blogs', () => {
        const result = mostBlogs([])
        const correct = {
            author: '',
            blogs: 0
        }
        assert.deepStrictEqual(result, correct)
    })
    
    test('when list has only one blog returns that author with one blog', () => {
        const result = mostBlogs(blogLists.listWithOneBlog)
        const correct = {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }
        assert.deepStrictEqual(result, correct)
    })

    test('of a bigger list returns correct author and blog count', () => {
        const result = mostBlogs(blogLists.blogs)
        const correct = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        assert.deepStrictEqual(result, correct)
    })
})
