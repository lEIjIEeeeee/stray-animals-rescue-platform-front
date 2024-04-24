import http from '@/utils/http'

export const getPlatformCommentListApi = (params) =>
  http.get('/commentModule/platform/comment/listPage', {
    params
  })

export const deleteCommentApi = (data) => http.post('/commentModule/platform/comment/delete', data)
