export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchContent
  isAdopt
  isLost
}

export class AnimalCard {
  id = ''
  name = ''
  categoryName = ''
  isAdopt
  isLost
  picUrl = ''
}

export class AnimalDetail {
  id = ''
  name = ''
  animalNo = ''
  categoryName = ''
  ownerName = ''
  ownerPhone
  gender = ''
  birthday = ''
  weight = 0
  isAdopt = 0
  isLost = 0
  picUrl = ''
  desc = ''
}

export class AdoptApplyInfo {
  animalId = ''
  contactPhone = ''
  remark = ''
}

export class ContributionApplyInfo {
  animalId = ''
  itemType = 'FOOD'
  itemName = ''
  itemPic = ''
  contactPhone = ''
  remark = ''
}
