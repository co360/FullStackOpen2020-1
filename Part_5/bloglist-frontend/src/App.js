import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [notification, setNewNotification] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = React.createRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    // try get user from localstorage
    useEffect(() => {
        const persistingUser = window.localStorage.getItem('loggedBlogUser')
        if (persistingUser) {
            const user = JSON.parse(persistingUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const logOut = () => {
        blogService.setToken(null)
        setUser(null)
        window.localStorage.removeItem('loggedBlogUser')
    }

    const notify = message => {
        setNewNotification(message)
        setTimeout(() => setNewNotification(null), 5000)
    }

    const handleLogin = async event => {
        event.preventDefault()
        console.log(`logging in with ${username} : ${password}`)
        try {
            const user = await loginService.login({ username: username, password: password })
            setUser(user)
            window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
            console.log(user)
            setUsername('')
            setPassword('')
            notify('Logged in')
            blogService.setToken(user.token)
        } catch (e) {
            notify('Invalid credetials')
        }
    }

    const handleNewBlog = async newblog => {
        blogFormRef.current.toggleVisibility()
        console.log(`adding new blog: ${newblog}`)
        try {
            const blog = await blogService.postNew(newblog)
            if (blog) {
                setBlogs(blogs.concat(blog))
            }
            notify('added blog')
        } catch (e) {
            notify('invalid token')
        }
    }

    const handleLike = async blog => {
        console.log(`adding like to blog: ${blog}`)
        try {
            const update_fields = {
                likes: blog.likes + 1
            }
            const updated_blog = await blogService.updateBlog(blog.id, update_fields)
            if (updated_blog) {
                setBlogs(blogs.map(blog => updated_blog.id === blog.id ? updated_blog : blog))
            }
        } catch (e) {
            notify('invalid token')
        }
    }

    const handleDelete = async delete_blog => {
        if (window.confirm(`Really delete blog ${delete_blog.title}`)) {
            try {
                const status = await blogService.deleteBlog(delete_blog.id)
                if (status === 204) {
                    setBlogs(blogs.filter(blog => delete_blog.id !== blog.id))
                }
            } catch (e) {
                notify('invalid token')
            }
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin} >
            <div>
                username
                    <input type='text' value={username} name='Username'
                    onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
                password
                    <input type='text' value={password} name='Password'
                    onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type='submit'>login</button>
        </form>
    )

    const userDisplay = () => (
        <div>
            <p>Hello {user.name}</p>
            <button onClick={logOut}>log out</button>
        </div>
    )

    if (!user) {
        return (
            loginForm()
        )
    }



    return (
        <div>
            <Notification message={notification} />
            {
                userDisplay()
            }
            <Toggleable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm addNewBlog={handleNewBlog}/>
            </Toggleable>
            <h2>Blogs</h2>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog}
                    onLikeBlog={handleLike}
                    onDeleteBlog={handleDelete}
                    isOwner={blog?.user?.username === user.username}
                />
            )}
        </div>
    )
}

export default App