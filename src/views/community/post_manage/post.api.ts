import http from '@/utils/http'

export const getPlatformPostListApi = (params) =>
  http.get('/postModule/platform/post/listPage', {
    params
  })

export const postAuditApi = (data) => http.post('/postModule/platform/post/audit', data)

export const postClosedApi = (data) => http.post('/postModule/platform/post/close', data)
