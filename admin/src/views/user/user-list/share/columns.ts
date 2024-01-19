import type { Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'loginName',
      label: '登录账号',
      // required: true,
      search: true
    },
    {
      prop: 'password',
      label: '密码',
      hideInPages: ['list', 'edit'],
      inputType: 'password'
      // required: true
    },
    {
      prop: 'phone',
      label: '手机号',
      // required: true,
      search: true
    },
    {
      prop: 'name',
      label: '姓名',
      // required: true,
      search: true
    },
    {
      prop: 'gender',
      label: '性别',
      search: true,
      type: 'select'
    },
    {
      prop: 'status',
      label: '状态',
      search: true,
      tagType: {
        1: 'success',
        2: 'danger'
      },
      type: 'select'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      hideInPages: ['add', 'edit'],
      search: true,
      searchDatepickerType: 'datetimerange',
      type: 'date-picker',
      datepickerType: 'datetime'
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      hideInPages: ['add', 'edit'],
      search: true,
      type: 'date-picker',
      datepickerType: 'datetime'
    }
  ] as Column[]
}
