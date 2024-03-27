import http from '@/utils/http'

export const getAnimalOwnerListApi = () => http.get('/commonModule/common/getAnimalOwnerList')

export const uploadFileApi = (data) =>
  http.post('/commonModule/common/uploadFile', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
