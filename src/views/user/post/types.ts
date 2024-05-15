export class PostList {
  pageNo
  pageSize
  total
  dataList
}

export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = ''
  searchContent = ''
  bizType = ''
  categoryIds = ''
  createStartTime = ''
  createEndTime = ''
}

export class AddPostForm {
  title = ''
  categoryId = ''
  bizType = 'ADOPT_BIZ'
  picUrl = ''
  postAbstract = ''
  content = ''
}

export class PostDetailInfo {
  status = 0
  title = ''
  avatar = ''
  nickName = ''
  createId = ''
  createTime = ''
  categoryName = ''
  bizType = 0
  content = ''
  picUrl = ''
}
