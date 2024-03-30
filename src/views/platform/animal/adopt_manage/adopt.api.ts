import http from '@/utils/http'

export const getPlatformAdoptListApi = (params) =>
  http.get('/adoptModule/platform/adopt/listPage', {
    params
  })

export const getRecordDetailApi = (id) =>
  http.get('/adoptModule/platform/adopt/getRecordDetail', {
    params: {
      id
    }
  })

export const getAuditDetailApi = (id) =>
  http.get('/adoptModule/platform/adopt/getAuditDetail', {
    params: {
      id
    }
  })

export const auditApi = (data) => http.post('/adoptModule/platform/adopt/audit', data)
