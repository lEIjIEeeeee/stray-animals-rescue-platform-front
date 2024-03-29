import http from '@/utils/http'

export const getPostListApi = (params) =>
  http.get('/postModule/post/listPage', {
    params
  })

export const submitPostApi = (data) => http.post('/postModule/post/submitPost', data)
