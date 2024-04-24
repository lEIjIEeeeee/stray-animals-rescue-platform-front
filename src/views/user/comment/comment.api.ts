import http from '@/utils/http'

export const getCommentListPageApi = (params) =>
  http.get('/commentModule/comment/listPage', {
    params
  })

export const getReplayListPageApi = (params) =>
  http.get('/commentModule/comment/listPageReplay', {
    params
  })

export const sendCommentApi = (data) => http.post('/commentModule/comment/sendComment', data)

export const sendReplayApi = (data) => http.post('/commentModule/comment/replay', data)

export const getCountsApi = (postId) =>
  http.get('/commentModule/comment/getCounts', {
    params: {
      postId
    }
  })
