export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent
  status
  auditTime = []
  adoptDate = []
  applyTime = []
}

export class SearchRequest {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent
  status
  auditStartTime
  auditEndTime
  adoptStartDate
  adoptEndDate
  applyStartTime
  applyEndTime
}

export class AuditDetailInfo {
  animalName = ''
  animalNo = ''
  categoryName = ''
  isAdopt = 0
  isLost = 0
  ownerName = ''
  ownerPhone = ''
  adoptUserName = ''
  contactPhone = ''
  remark = ''
  auditResult = ''
  auditUserName = ''
  auditTime = ''
  auditRemark = ''
}

export class AuditInfo {
  id = ''
  auditResult = 'PASS'
  auditRemark = ''
}

export class AdoptRecordDetail {
  status = 0
  animalName = ''
  animalNo = ''
  categoryName
  ownerName = ''
  ownerPhone = ''
  picUrl = ''
  adoptUserName = ''
  adoptUserAccount = ''
  contactPhone = ''
  remark = ''
  applyTime = ''
  auditResult = ''
  auditUserName = ''
  auditTime = ''
  auditRemark = ''
}
