import { ValidationOptions, ValidateIf } from 'class-validator'

// 忽略null,undefined,''
export function IsOptionalPlus(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => {
    return value !== null && value !== undefined && value !== ''
  }, validationOptions)
}
// 空校验
export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return ValidateIf((_, value) => {
    console.log('value:', value)
    return true
  }, validationOptions)
}
