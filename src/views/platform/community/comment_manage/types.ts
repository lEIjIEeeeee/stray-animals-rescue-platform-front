export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'COMMENT_USER'
  searchContent = ''
  type = ''
  commentTime = []
}

export class CommentQueryRequest {
  pageNo = 1
  pageSize = 20
  searchType = 'COMMENT_USER'
  searchContent = ''
  type = ''
  startTime = ''
  endTime = ''
}
