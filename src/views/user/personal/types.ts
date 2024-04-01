export class PersonalInfo {
  id
  avatar
  account
  userType
  phone
  nickName
  gender
  realName
  createTime
}

export class PersonalFormData {
  id
  avatar
  phone
  nickName
  gender
  realName
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
