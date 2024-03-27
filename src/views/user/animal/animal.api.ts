import http from '@/utils/http'

export const getAnimalListApi = (params) =>
  http.get('/animalModule/animal/listPage', {
    params
  })

export const getAnimalListByCategoryIdApi = (params?) =>
  http.get('/animalModule/animal/getAnimalListByCategoryId', {
    params
  })
