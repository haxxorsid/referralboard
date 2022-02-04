import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5555'
})

export function getPosts() {
  return api.get('/api/posts')
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error.message
    })
};