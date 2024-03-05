import axios, { CustomParamsSerializer } from 'axios'
import { getToken, removeToken, removeUserType } from '../auth'
import router from '@/router'
import { get } from 'lodash'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

http.interceptors.request.use(
  async (config): Promise<any> => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = getToken()
    }
    return Promise.resolve(config)
  },
  (err) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (result) => {
    const code = get(result.data, 'code')
    const message = get(result.data, 'message')
    if (code !== 0) {
      if (code === 1001 || code === 1002) {
        removeToken()
        removeUserType()
        ElMessage.error('请先登录')
        router.push('/login')
      } else {
        ElMessage.error(message)
      }
    }
    return result.data
  },
  (err) => {
    ElMessage.error(err.response.data.message)
    return Promise.reject(err)
  }
)

export default http
