import { base, AcceptEnum, type Column } from 'chant'

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
      propInList: 'orgName',
      label: '部门',
      dynamicPicker: 'org-tree',
      required: true,
      search: true,
      slot: ['search'],
      change(form, row) {
        if (row.roleIds) {
          const roleIds = row.roleIds.concat(form.roleIds)
          form.roleIds = base.distinct(roleIds)
        }
        form.positionId = ''
      }
    },
    {
      prop: 'positionId',
      propInList: 'positionName',
      label: '职位',
      required: true,
      search: true,
      slot: ['form', 'search']
    },
    {
      prop: 'roleIds',
      propInList: 'roleNames',
      label: '角色',
      newlineFull: true,
      required: true,
      slot: ['form']
    },
    {
      prop: 'gender',
      label: '性别',
      search: true,
      type: 'select'
    },
    {
      prop: 'avatar',
      label: '头像',
      hideInPages: ['list'],
      uploader: 'single-image',
      accept: AcceptEnum.Image,
      fileBizType: 'avatar'
    }
  ] as Column[]
}
