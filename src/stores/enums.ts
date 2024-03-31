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
    value: 99
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

export const auditStatusDict = [
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

export const userTypeDict = [
  {
    label: '普通用户',
    code: 'NORMAL_USER'
  },
  {
    label: '平台管理员',
    code: 'PLATFORM_ADMIN'
  }
]

export const userStatusDict = [
  {
    label: '正常',
    code: 'NORMAL',
    value: 1
  },
  {
    label: '禁用',
    code: 'FREEZE',
    value: 2
  }
  // {
  //   label: '删除',
  //   code: 'DELETE',
  //   value: 99
  // }
]

export const contributionTypeDict = [
  {
    code: 'FOOD',
    label: '食物',
    value: 1
  },
  {
    code: 'CLOTHES',
    label: '衣服',
    value: 2
  },
  {
    code: 'TOY',
    label: '玩具',
    value: 3
  },
  {
    code: 'OTHERS',
    label: '其他',
    value: 99
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
