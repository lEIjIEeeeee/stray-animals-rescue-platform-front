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
  gender
  ownerId
  ownerName
  isAdopt
  isLost
  desc
}

export class EditAnimalInfo {
  id
  name
  gender
  categoryId
  ownerId
  desc
}
