import http from '@/utils/http'

export const getNoticeArticleListApi = (params) =>
  http.get('/noticeModule/platform/noticeArticle/listPage', {
    params
  })

export const getDetailApi = (id) =>
  http.get('/noticeModule/platform/noticeArticle/get', {
    params: {
      id
    }
  })

export const addNoticeArticleApi = (data) =>
  http.post('/noticeModule/platform/noticeArticle/add', data)

export const editNoticeArticleApi = (data) =>
  http.post('/noticeModule/platform/noticeArticle/edit', data)

export const deleteNoticeArticleApi = (data) =>
  http.post('/noticeModule/platform/noticeArticle/delete', data)
