import api from '../../src-server/api/index.js'
import { Auth } from 'aws-amplify'

export default {
  async call (payload) {
    
    const user = await Auth.currentUserInfo()
    payload.user_id = parseInt(user.attributes['custom:user_id']);
    
    const result = await api[payload.action](payload)
    
    return { data: result }
  }
}
