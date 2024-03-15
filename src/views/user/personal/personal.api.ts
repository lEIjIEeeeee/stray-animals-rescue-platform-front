import http from '@/utils/http'

export const getPersonalInfoApi = () => http.get('/commonModule/common/personalInfo')

export const getCountsApi = () => http.get('/commonModule/common/getCounts')

export const getPersonalAnimalListApi = (params) =>
  http.get('/commonModule/personal/listPageAnimal', {
    params
  })

export const getPersonalPostListApi = (params) =>
  http.get('/commonModule/personal/listPagePost', {
    params
  })
