const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const blogLists = require('./blogLists')

describe('favoriteBlog', () => {
    test('of empty list has no title or author and zero likes', () => {
        const result = favoriteBlog([])
        const correct = {
            title: '',
            author: '',
            likes: 0
        }
        assert.deepStrictEqual(result, correct)
    })
    
    test('when list has only one blog has the title, author and likes of that', () => {
        const result = favoriteBlog(blogLists.listWithOneBlog)
        const correct = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
        }
        assert.deepStrictEqual(result, correct)
    })

    test('of a bigger list returns the blog with most likes', () => {
        const result = favoriteBlog(blogLists.blogs)
        const correct = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        }
        assert.deepStrictEqual(result, correct)
    })
})
