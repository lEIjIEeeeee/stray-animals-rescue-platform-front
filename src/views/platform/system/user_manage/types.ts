export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'NICK_NAME'
  searchContent = ''
  userType
  gender
  status
  createDate = []
}

export class PlatformUserList {
  pageNo
  pageSize
  total
  dataList
}

export class ChangeUserStatus {
  id
  status
}

export class UserDetailFormData {
  avatar = ''
  nickName = ''
  password = ''
  confirmPassword = ''
  account = ''
  phone = ''
  realName = ''
  gender = 'M'
  userType = 'NORMAL_USER'
  status = 1
}

export class UserAddRequest {
  avatar
  nickName
  password
  confirmPassword
  account
  phone
  realName
  gender = 'M'
  userType = 'NORMAL_USER'
  status
}

export class UserEditRequest {
  id
  avatar
  nickName
  account
  phone
  realName
  gender = 'M'
  userType = 'NORMAL_USER'
  status
}
