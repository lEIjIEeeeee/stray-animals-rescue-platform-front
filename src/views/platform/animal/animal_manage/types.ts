export class SearchParams {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent = ''
  gender = ''
  categoryIds = []
  isAdopt = ''
  isLost = ''
  createDate = []
}

export class AnimalListRequest {
  pageNo = 1
  pageSize = 20
  searchType = 'ANIMAL_NAME'
  searchContent = ''
  gender = ''
  categoryIds = []
  isAdopt = ''
  isLost = ''
  createStartDate = ''
  createEndDate = ''
}

export class PlatformAnimalList {
  pageNo
  pageSize
  total
  dataList
}

export class ChangeAdoptStatus {
  id
  isAdopt
}

export class ChangeLostStatus {
  id
  isLost
}

export class AnimalDetail {
  id
  name
  animalNo
  categoryId
  categoryName
  ownerId
  ownerName
  gender
  birthday
  weight
  isAdopt
  isLost
  desc
}
export class AnimalAddInfo {
  name
  categoryId
  ownerId
  gender = 'M'
  birthday
  weight
  isAdopt = 0
  isLost = 0
  imgUrl = ''
  desc
}

export class AnimalEditInfo {
  id
  name
  categoryId
  ownerId
  birthday
  gender
  weight
  desc
}
