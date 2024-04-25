const { test, describe } = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes
const blogLists = require('./blogLists')

describe('totalLikes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes([])
        assert.strictEqual(result, 0)
    })
    
    test('when list has only one blog equals the likes of that', () => {
        const result = totalLikes(blogLists.listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated correctly', () => {
        const result = totalLikes(blogLists.blogs)
        assert.strictEqual(result, 36)
    })
})