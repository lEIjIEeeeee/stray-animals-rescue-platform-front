export class PostListRequest {
  pageNo = 1
  pageSize = 20
  searchType = 'POST_TITLE'
  searchContent = ''
  bizType = ''
  categoryIds = []
  auditStartDate = ''
  auditEndDate = ''
  createStartDate = ''
  createEndDate = ''
  status = ''
}

export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'POST_TITLE'
  searchContent = ''
  categoryIds = []
  bizType = ''
  status = ''
  auditDate = []
  createDate = []
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

export class PostCloseInfo {
  id
  closeReason
}
