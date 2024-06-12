import { AcceptEnum, type Column } from 'chant'

export default () => {
  return [
    {
      prop: 'loginName',
      label: '登录账号',
      disabledInPage: 'edit',
      required: true,
      search: true
    },
    {
      prop: 'password',
      label: '密码',
      hideInPages: ['list', 'edit', 'detail'],
      required: true
    },
    {
      prop: 'name',
      label: '姓名',
      required: true,
      search: true
    },
    {
      prop: 'phone',
      label: '手机号',
      copy: true,
      required: true,
      search: true
    },
    {
      prop: 'orgId',
      propList: 'orgName',
      label: '部门',
      dynamicPicker: 'org-tree',
      required: true,
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
      hideInPages: ['add'],
      search: true,
      tagType: {
        1: 'success',
        2: 'danger'
      },
      type: 'select'
    },
    {
      prop: 'avatar',
      label: '头像',
      hideInPages: ['list'],
      type: 'upload',
      accept: AcceptEnum.Image,
      fileBizType: 'avatar',
      uploadType: 'single-image'
    }
  ] as Column[]
}
