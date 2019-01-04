import axios from 'axios'

export default {
  async call (payload) {
    const result = await axios.post('/api', payload)
    return result.data
  }
}
