import http from '@/utils/http'

export const getPlatformUserListApi = (params) =>
  http.get('/authModule/platform/user/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/authModule/platform/user/get', {
    params: {
      id
    }
  })

export const addUserApi = (data) => http.post('/authModule/platform/user/add', data)

export const editUserApi = (data) => http.post('/authModule/platform/user/edit', data)

export const changeUserStatusApi = (data) =>
  http.post('/authModule/platform/user/changeStatus', data)

export const resetPasswordApi = (data) => http.post('/authModule/platform/user/resetPassword', data)
