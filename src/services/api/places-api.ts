import axios from 'axios'

export const placesApi = axios.create({
  baseURL: 'http://localhost:3001/'
})
