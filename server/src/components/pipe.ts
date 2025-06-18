import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform
} from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

function formatZodError(error: ZodError) {
  return error.errors.map((err) => err.message)
}

export class ZodValidation implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metaData: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(formatZodError(error))
      }
      throw new BadRequestException(error)
    }
  }
}
