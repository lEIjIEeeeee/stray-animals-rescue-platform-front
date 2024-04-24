export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchContent = ''
  noticeTypeId = ''
}

export class NoticeTypeItem {
  id = ''
  name = ''
}

export class NoticeArticleBaseInfo {
  name = ''
  picUrl = ''
  noticeTypeId = ''
  desc = ''
  sort
}

export class NoticeArticleContent {
  content = ''
}
