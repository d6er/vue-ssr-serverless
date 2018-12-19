import axios from 'axios'

export default {
  call (payload) {
    return axios.post('/api', payload)
  }
}
