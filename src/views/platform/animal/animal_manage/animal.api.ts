import http from '@/utils/http'
import { stringify } from 'qs'

export const getPlatformAnimalListApi = (params) =>
  http.get('/animalModule/platform/animal/listPage', {
    params,
    paramsSerializer: function (params) {
      return stringify(params, { arrayFormat: 'repeat' })
    }
  })

export const getAnimalDetailApi = (id) =>
  http.get('/animalModule/platform/animal/get', {
    params: {
      id
    }
  })

export const editAnimalInfoApi = (data) => http.post('animalModule/platform/animal/edit', data)

export const changeAdoptStatusApi = (data) =>
  http.post('/animalModule/platform/animal/changeAdoptStatus', data)

export const changeLostStatusApi = (data) =>
  http.post('/animalModule/platform/animal/changeLostStatus', data)

export const animalDeleteApi = (data) => http.post('/animalModule/platform/animal/delete', data)
