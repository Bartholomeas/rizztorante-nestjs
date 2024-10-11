import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isRating", async: true })
class IsRatingConstraint implements ValidatorConstraintInterface {
  validate(value: number): Promise<boolean> | boolean {
    return value >= 1 && value <= 5 && value % 0.5 === 0;
  }
}
export function IsRating(
  validationOptions: ValidationOptions = {
    message: "Rating must be a number between 1 and 5 and a multiple of 0.5",
  },
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRatingConstraint,
    });
  };
}
