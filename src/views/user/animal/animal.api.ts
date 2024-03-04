import http from '@/utils/http'

export const getAnimalListByCategoryIdApi = (params?) =>
  http.get('/animalModule/animal/getAnimalListByCategoryId', {
    params
  })
