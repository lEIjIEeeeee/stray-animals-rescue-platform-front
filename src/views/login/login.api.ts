import http from '@/utils/http'

export const loginApi = (data) => http.post('/authModule/login/login', data)

export const logoutApi = () => http.post('/authModule/login/logout')
