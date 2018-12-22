import api from '../../src-server/api/index.js'

export default {
  call (payload) {
    return api[payload.action](payload).then(r => {
      return { data: r }
    })
  }
}
