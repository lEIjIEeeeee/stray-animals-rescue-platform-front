export class PersonalInfo {
  id
  avatar
  nickName
  userType
  createTime
}

export class UserBizCounts {
  accessAmount: number
  animalAmount: number
  postAmount: number
  applyAmount: number
}

export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchContent = ''
}

export class BaseListResponse {
  pageNo
  pageSize
  total
  dataList
}
