import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'loginName', // 登录账号
      disabledInPage: 'edit',
      required: true,
      search: true
    },
    {
      prop: 'password', // 密码
      hideInPages: ['list', 'edit'],
      required: true
    },
    {
      prop: 'name', // 姓名
      required: true,
      search: true
    },
    {
      prop: 'phone', // 手机号
      required: true,
      search: true
    },
    {
      prop: 'gender', // 性别
      search: true,
      type: 'select'
    },
    {
      prop: 'status', // 状态
      hideInPages: ['add'],
      search: true,
      tagType: {
        1: 'success',
        2: 'danger'
      },
      type: 'select'
    },
    {
      prop: 'avatar', // 头像
      type: 'upload',
      fileBizType: 'avatar',
      uploadType: 'single-image'
    },
    {
      prop: 'testList', // 测试
      label: '测试',
      type: 'upload',
      limit: 3,
      fileBizType: 'avatar',
      multiple: true,
      uploadType: 'file-list'
    }
  ] as Column[]
}
