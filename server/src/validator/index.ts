import { IsNotEmpty, ValidateIf, ValidationOptions } from 'class-validator'

// 忽略null,undefined,''
export function IsOptional(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => {
    return value !== null && value !== undefined && value !== ''
  }, validationOptions)
}
// id校验
export class IdVali {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
