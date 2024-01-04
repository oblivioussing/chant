import {
  FormTypeEnum,
  UploadTypeEnum,
  type FormColumn as Column
} from '@/chant'

export default () => {
  return [
    {
      prop: 'name', // 姓名
      required: true
    },
    {
      prop: 'age', // 年龄
      min: 10,
      max: 100,
      type: FormTypeEnum.InputNumber
    },
    {
      prop: 'sex', // 性别
      required: true,
      type: FormTypeEnum.Select
    },
    {
      prop: 'createTime', // 创建时间
      type: FormTypeEnum.DatetimeRange
    },
    {
      prop: 'avatar', // 头像
      label: '头像',
      required: true,
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.SingleImage
    },
    {
      prop: '文件列表', // 文件列表
      label: '文件列表',
      multiple: true,
      required: true,
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.FileList
    },
    {
      prop: '图片列表', // 图片列表
      label: '图片列表',
      multiple: true,
      required: true,
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.PictureCard
    },
    {
      prop: 'remark', // 备注
      type: FormTypeEnum.Textarea
    }
  ] as Column[]
}
