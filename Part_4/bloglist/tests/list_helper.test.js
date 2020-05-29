const blogs = require('../utils/blogs_for_tests')
const list_helper = require('../utils/list_helper')
describe('list_helper misc', () => {
    test('dummy returns constant', () => {
        const res = list_helper.dummy([])
        expect(res).toBe(1)
    })

})

describe('total likes', () => {
    test('when list has only 1 entry, total likes should equal likes of that entry', () => {
        const blog = blogs[blogs.length * Math.random() | 0] // sample random from blogs
        expect(list_helper.total_likes([blog])).toBe(blog.likes)
    })

    test('when list has many blogs, return correct total', () => {
        const correct = blogs.reduce((a, c) => a + c.likes, 0)
        expect(list_helper.total_likes(blogs)).toBe(correct)
    })

    test('when list is empty, return 0', () => {
        expect(list_helper.total_likes([])).toBe(0)
    })
})