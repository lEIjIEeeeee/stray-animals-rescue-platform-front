import http from '@/utils/http'

export const getCategoryTreeApi = () => http.get('/commonModule/common/getCategoryTree')

export const getCategoryListApi = (params) =>
  http.get('/categoryModule/platform/category/listPage', {
    params
  })

export const getCategoryDetailApi = (id) =>
  http.get('/categoryModule/platform/category/get', {
    params: {
      id
    }
  })

export const categoryAddApi = (data) => http.post('/categoryModule/platform/category/add', data)

export const categoryEditApi = (data) => http.post('/categoryModule/platform/category/edit', data)

export const changeStatusApi = (data) =>
  http.post('/categoryModule/platform/category/changeStatus', data)

export const categoryDeleteApi = (data) =>
  http.post('/categoryModule/platform/category/delete', data)
