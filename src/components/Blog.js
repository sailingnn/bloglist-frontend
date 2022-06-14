import { useState } from 'react'

const Detail = ({ view, blog, creator, addLike, deleteBlog, user }) => {
  const showWhenUserMatch = { display: user===creator? '':'none' }
  if(view === false){
    // console.log('show details of ', url)
    return(
      <div>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button id="like-button" onClick={addLike.bind(this, blog)}>like</button></p>
        <p>{creator}</p>
        <div style={showWhenUserMatch}>
          <p><button id="delete-button" onClick={deleteBlog.bind(this, blog)}>delete</button></p>
        </div>
      </div>
    )
  }
}
const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [view, setView] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const viewOrHide =  view ? 'view' : 'hide'

  const handleView = () => {
    setView(!view)
  }

  const { user:{ name } } = blog
  // console.log('blog: ', blog)
  // console.log('blog.user:', blog.user)
  // console.log('name:', blog.user.name)
  return(
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author} <button id="view-button" onClick={handleView}>
          {viewOrHide}
        </button>
      </div>
      <Detail view ={view} blog = {blog} creator = {name} addLike = {addLike} deleteBlog={deleteBlog} user={user}/>
    </div>
  )}

export default Blog