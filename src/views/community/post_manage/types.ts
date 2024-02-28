export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'POST_TITLE'
  searchContent = ''
  bizType
  categoryIds = []
  auditTime = []
  createTime = []
  status = ''
}

export class PlatformPostList {
  pageNo
  pageSize
  total
  dataList
}

export class PostAuditInfo {
  id
  auditResult = 'PASS'
  auditRemark
}

export class PostIdRequest {
  id
}
