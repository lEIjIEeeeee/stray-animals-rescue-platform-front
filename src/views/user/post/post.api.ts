import http from '@/utils/http'

export const getPostListApi = (params) =>
  http.get('/postModule/post/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/postModule/post/get', {
    params: {
      id
    }
  })

export const submitPostApi = (data) => http.post('/postModule/post/submitPost', data)

export const resubmitPostApi = (data) => http.post('/postModule/post/resubmitPost', data)

export const deletePostApi = (data) => http.post('/postModule/post/delete', data)
