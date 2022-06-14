import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import AddForm from './components/AddForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, noteStyle }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={noteStyle} className="error" >
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const infoStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const errorStyle = { ...infoStyle, color: 'red' }
  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs.sort(compareLikes) )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = (blog) => {
    // console.log('like add 1...')
    const newlikes = blog.likes + 1
    const editedBlog = {
      user: blog.user.id,
      likes: newlikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    // console.log('blog.id:', blog.id)
    // console.log('blog:', blog)
    blogService.update(blog.id, editedBlog)
      .then(newblog => {
        let tmp = blogs.filter(blog => blog.id!==newblog.id)
        setBlogs(tmp.concat(newblog))
      })
  }

  const deleteBlog=(blog) => {
    if(window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)){
      try{
        blogService.deleteOne(blog.id)
          .then(setBlogs(blogs.filter(blogNow => blogNow.id!==blog.id)))
      } catch(exception){
        setErrorMessage('Cannot delete blog...' + exception)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const addBlog = (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      // console.log('blogObject: ', blogObject)
      blogService.create(blogObject)
        .then(returnedBlog => {
          setInfoMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
          setBlogs(blogs.concat(returnedBlog))
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)
        })
    } catch(exception){
      setErrorMessage('Cannot create blog...')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken('')
  }

  const blogContent = () => (
    <div>
      {blogs.sort(compareLikes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog} user={user.name}/>
        )}
    </div>
  )

  return (
    <div>
      {user === null ?
        <div>
          <h2>log in to application</h2>
          <Notification message={infoMessage} noteStyle={infoStyle} />
          <Notification message={errorMessage} noteStyle={errorStyle} />
          <LoginForm handleLogin={handleLogin}
            username={username}
            handleUsernameChange={({ target }) => setUsername(target.value)} password={password}
            handlePasswordChange={({ target }) => setPassword(target.value)}/>
        </div>:
        <div>
          <h2>blogs</h2>
          <Notification message={infoMessage} noteStyle={infoStyle} />
          <Notification message={errorMessage} noteStyle={errorStyle} />
          <p>{user.name} logged-in<button onClick={handleLogout}>
          logout
          </button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <AddForm createBlog={addBlog} />
          </Togglable>
          {blogContent()}
        </div>
      }
    </div>
  )
}

export default App
