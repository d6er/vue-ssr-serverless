const axios = require('axios')

const apiUrl = '/api'

module.exports = {
  call: (payload) => {
    return axios.post(apiUrl, payload)
  }
}
