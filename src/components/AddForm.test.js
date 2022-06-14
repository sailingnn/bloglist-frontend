import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddForm from './AddForm'
import userEvent from '@testing-library/user-event'

test('<AddForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<AddForm createBlog={createBlog} />)

  const input = container.querySelector('#blog-title')
  const input2 = container.querySelector('#blog-author')
  const input3 = container.querySelector('#blog-url')
  //const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  //await user.type(inputs[0], 'testing a form Title...' )
  //await user.type(inputs[1], 'testing a form Author...' )
  //await user.type(inputs[2], 'testing a form Url...' )
  await user.type(input, 'testing a form Title...')
  await user.type(input2, 'testing a form Author...')
  await user.type(input3, 'testing a form Url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  //console.log(createBlog.mock.calls[0][0])
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form Title...' )
  expect(createBlog.mock.calls[0][0].author).toBe('testing a form Author...' )
  expect(createBlog.mock.calls[0][0].url).toBe('testing a form Url...' )
  expect(createBlog.mock.calls[0][0].likes).toBe(0)
})