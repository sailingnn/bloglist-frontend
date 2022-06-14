import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'author testing',
    title: 'Component testing is done with react-testing-library',
    likes: 0,
    url: 'url testing',
    user: 'user testing',
  }

  render(<Blog blog={blog} />)

  //   screen.debug()

  const title = screen.getByText('Component testing is done with react-testing-library', { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText('author testing', { exact: false })
  expect(author).toBeDefined()
  const url = screen.queryByText('url testing')
  expect(url).toBeNull()
  const likes = screen.queryByText('likes: 0')
  expect(likes).toBeNull()
})

test('clicking the button shows details', async () => {
  const blog = {
    author: 'author testing',
    title: 'Component testing is done with react-testing-library',
    likes: 0,
    url: 'url testing',
    user: 'user testing',
  }

  const mockHandler = jest.fn()
  const deleteHandler = jest.fn()
  const username = 'user one'
  render(<Blog blog={blog} addLike={mockHandler} user={username} deleteBlog={deleteHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.queryByText('url testing')
  expect(url).toBeDefined()
  const likes = screen.queryByText('likes 0')
  expect(likes).toBeDefined()
//   screen.debug(likes)
})


test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    author: 'author testing',
    title: 'Component testing is done with react-testing-library',
    likes: 0,
    url: 'url testing',
    user: 'user testing',
  }

  const mockHandler = jest.fn()
  const deleteHandler = jest.fn()
  const username = 'user one'
  render(<Blog blog={blog} addLike={mockHandler} user={username} deleteBlog={deleteHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})