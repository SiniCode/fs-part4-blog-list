const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostLikes = require('../utils/list_helper').mostLikes
const blogLists = require('./blogLists')

describe('mostLikes', () => {
    test('of empty list returns empty author with zero likes', () => {
        const result = mostLikes([])
        const correct = {
            author: '',
            likes: 0
        }
        assert.deepStrictEqual(result, correct)
    })
    
    test('when list has only one blog returns that author and likes', () => {
        const result = mostLikes(blogLists.listWithOneBlog)
        const correct = {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }
        assert.deepStrictEqual(result, correct)
    })

    test('of a bigger list returns correct author and like count', () => {
        const result = mostLikes(blogLists.blogs)
        const correct = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        assert.deepStrictEqual(result, correct)
    })
})
