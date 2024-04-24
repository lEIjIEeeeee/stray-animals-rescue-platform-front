import http from '@/utils/http'

export const getNoticeListApi = (params) =>
  http.get('/noticeModule/notice/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/noticeModule/notice/get', {
    params: {
      id
    }
  })

export const getNoticeTypeDropdownListApi = () =>
  http.get('/noticeModule/notice/getNoticeTypeDropdownList')
