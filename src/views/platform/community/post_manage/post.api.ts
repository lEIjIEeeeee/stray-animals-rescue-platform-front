import http from '@/utils/http'

export const getPlatformPostListApi = (params) =>
  http.get('/postModule/platform/post/listPage', {
    params
  })

export const getCloseReasonApi = (id) =>
  http.get('/postModule/platform/post/getCloseReason', {
    params: {
      id
    }
  })

export const postAuditApi = (data) => http.post('/postModule/platform/post/audit', data)

export const postClosedApi = (data) => http.post('/postModule/platform/post/close', data)

export const postDeleteApi = (data) => http.post('/postModule/platform/post/delete', data)
