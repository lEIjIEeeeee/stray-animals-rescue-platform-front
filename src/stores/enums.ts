export const bizTypeDict = [
  {
    label: '领养',
    code: 'ADOPT_BIZ',
    value: 1
  },
  {
    label: '遗失',
    code: 'LOST_BIZ',
    value: 2
  },
  {
    label: '其他',
    code: 'OTHER',
    value: 3
  }
]

export const postStatusDict = [
  {
    label: '待审核',
    code: 'AUDIT_WAIT',
    value: 1
  },
  {
    label: '审核通过',
    code: 'AUDIT_PASS',
    value: 2
  },
  {
    label: '审核拒绝',
    code: 'AUDIT_REJECT',
    value: 3
  },
  {
    label: '已关闭',
    code: 'CLOSED',
    value: 4
  }
]

export const enableDict = [
  {
    label: '启用',
    code: 'ENABLE',
    value: 1
  },
  {
    label: '禁用',
    code: 'DISABLE',
    value: 2
  }
]

export const flagDict = [
  {
    label: '是',
    code: 'Y',
    value: 1
  },
  {
    label: '否',
    code: 'N',
    value: 0
  }
]

export const genderDict = [
  {
    label: '男',
    code: 'M'
  },
  {
    label: '女',
    code: 'F'
  }
]

export const animalGenderDict = [
  {
    label: '雄性',
    code: 'M'
  },
  {
    label: '雌性',
    code: 'F'
  }
]

export const getEnumNameByCode = (enumType, code: string) => {
  let enumName = ''
  enumType.forEach(function (item, inex) {
    if (item.code === code) {
      enumName = item.label
    }
  })
  return enumName
}

export const getEnumNameByValue = (enumType, val: number) => {
  let enumName = ''
  enumType.forEach(function (item, inex) {
    if (item.value === val) {
      enumName = item.label
    }
  })
  return enumName
}
