export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent = ''
  itemType = ''
  status = ''
  auditTime = []
  applyTime = []
}

export class SearchRequest {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent = ''
  itemType = ''
  status = ''
  auditStartTime = ''
  auditEndTime = ''
  applyStartTime = ''
  applyEndTime = ''
}

export class AuditDetailInfo {
  animalName = ''
  animalNo = ''
  categoryName = ''
  ownerName = ''
  ownerPhone = ''
  applyUserName = ''
  contactPhone = ''
  itemType = 0
  itemName = ''
  itemPic = ''
  createTime = ''
  remark = ''
  status = 0
  auditUserName = ''
  auditTime = ''
  auditRemark = ''
}

export class AuditInfo {
  id = ''
  auditResult = 'PASS'
  auditRemark = ''
}
