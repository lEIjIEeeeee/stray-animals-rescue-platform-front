import http from '@/utils/http'

export const getAnimalListApi = (params) =>
  http.get('/animalModule/animal/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/animalModule/animal/get', {
    params: {
      id
    }
  })

export const getAnimalListByCategoryIdApi = (params?) =>
  http.get('/animalModule/animal/getAnimalListByCategoryId', {
    params
  })

export const applyAdoptApi = (data) => http.post('/animalModule/animal/applyAdopt', data)

export const applyContributionApi = (data) =>
  http.post('/animalModule/animal/applyContribution', data)
