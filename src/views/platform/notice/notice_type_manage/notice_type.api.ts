import http from '@/utils/http'

export const getNoticeTypeListApi = (params) =>
  http.get('/noticeTypeModule/platform/noticeType/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/noticeTypeModule/platform/noticeType/get', {
    params: {
      id
    }
  })

export const addNoticeTypeApi = (data) =>
  http.post('/noticeTypeModule/platform/noticeType/add', data)

export const editNoticeTypeApi = (data) =>
  http.post('/noticeTypeModule/platform/noticeType/edit', data)

export const deleteNoticeTypeApi = (data) =>
  http.post('/noticeTypeModule/platform/noticeType/delete', data)

export const getDropDownListApi = () => http('/noticeTypeModule/platform/noticeType/dropdownList')
