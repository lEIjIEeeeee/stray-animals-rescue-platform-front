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

export class PostDetail {
  title = ''
  createId = ''
  nickName = ''
  createTime = ''
  categoryName = ''
  bizType = 0
  postAbstract = ''
  content = ''
  picUrl = ''
  status = 0
  auditorName = ''
  auditTime = ''
  auditRemark = ''
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
