import http from '@/utils/http'

export const getPlatformContributionListApi = (params) =>
  http.get('/contributionModule/platform/contribution/listPage', {
    params
  })

export const getRecordDetailApi = (id) =>
  http.get('/contributionModule/platform/contribution/getRecordDetail', {
    params: {
      id
    }
  })

export const getAuditDetailApi = (id) =>
  http.get('/contributionModule/platform/contribution/getAuditDetail', {
    params: {
      id
    }
  })

export const auditApi = (data) => http.post('/contributionModule/platform/contribution/audit', data)
