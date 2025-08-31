import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName,
      options: {
        ...validationOptions,
        message: `${propertyName} must be a valid ObjectId`,
      },
      validator: {
        validate(value: string): boolean {
          return Types.ObjectId.isValid(value);
        },
      },
    });
  };
}
