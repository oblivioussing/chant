import {
  registerDecorator,
  IsNotEmpty,
  ValidateIf,
  ValidationArguments,
  ValidationOptions
} from 'class-validator'
import { base } from '@/utils'

// 不能和另一个字段值相同
export function IsNotEqualTo(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [to] = args.constraints
          return value !== args.object[to]
        }
      }
    })
  }
}
// 忽略null,undefined,''
export function IsOptional(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => {
    return !base.isEmpty(value)
  }, validationOptions)
}
// id校验
export class IdVali {
  // id
  @IsNotEmpty({ message: 'id不能为空' })
  id: string
}
