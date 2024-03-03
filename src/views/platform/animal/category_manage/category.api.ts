import http from '@/utils/http'

export const getCategoryTreeApi = () => http.get('/categoryModule/category/getCategoryTree')

export const getCategoryListApi = (params) =>
  http.get('/categoryModule/category/listPage', {
    params
  })

export const getCategoryDetailApi = (id) =>
  http.get('/categoryModule/category/get', {
    params: {
      id
    }
  })

export const categoryAddApi = (data) => http.post('/categoryModule/category/add', data)

export const categoryEditApi = (data) => http.post('/categoryModule/category/edit', data)

export const changeStatusApi = (data) => http.post('/categoryModule/category/changeStatus', data)

export const categoryDeleteApi = (data) => http.post('/categoryModule/category/delete', data)
