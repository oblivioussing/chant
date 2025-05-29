import type { Column } from 'chant'

export default () => {
  return [
    {
      prop: 'name',
      label: '名称',
      required: true,
      search: true
    },
    {
      prop: 'roleIds',
      propInList: 'roleNames',
      label: '角色',
      newlineFull: true,
      slot: ['form']
    }
  ] as Column[]
}
