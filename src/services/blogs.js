import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  // console.log('newObject: ', newObject)
  // console.log('config of token:', config)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const deleteOne = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = axios.delete(baseUrl + '/' + id, config)
  return response
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const newUrl = baseUrl + '/' + id
  // console.log('newUrl: ', newUrl)
  const response = await axios.put(newUrl, newObject, config)
  // console.log('response: ', response)
  return response.data
}

export default { getAll, setToken, create, update, deleteOne }