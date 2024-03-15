import http from '@/utils/http'

export const registerApi = (data) => http.post('/authModule/login/register', data)
