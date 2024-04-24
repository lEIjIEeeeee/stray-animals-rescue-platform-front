import http from '@/utils/http'
import { stringify } from 'qs'

export const getPlatformPostListApi = (params) =>
  http.get('/postModule/platform/post/listPage', {
    params,
    paramsSerializer: function (params) {
      return stringify(params, { arrayFormat: 'repeat' })
    }
  })

export const getDetailApi = (id) =>
  http.get('/postModule/platform/post/get', {
    params: {
      id
    }
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
