import http from '@/utils/http'

export const getDetailApi = () => http.get('/postModule/post/get?id=1')
