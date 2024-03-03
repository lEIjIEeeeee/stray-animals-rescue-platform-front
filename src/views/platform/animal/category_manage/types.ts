export class SearchParams {
  pageNo = 1
  pageSize = 10
  pid = '0'
}

export class CategoryList {
  pageNo
  pageSize
  total
  dataList
}

export class ChangeStatusRequest {
  id
  status = 'DISABLE'
}

export class CategoryDetail {
  pid = []
  name
  status = 1
  sort: number
  remark
}

export class CategorySubmitDetail {
  pid = ''
  name
  status = ''
  sort
  remark
}
