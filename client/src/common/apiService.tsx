import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5555'
})

export function getCards() {
  return api.get('/cards')
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      return error.message
    })
};