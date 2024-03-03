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
  categoryIds = []
  createStartTime = ''
  createEndTime = ''
}

export class AddPostForm {
  title = ''
  bizType = 'ADOPT_BIZ'
  categoryId = ''
  animalId = ''
  animalName = ''
  animalGender = ''
  postAbstract = ''
  content = ''
}
