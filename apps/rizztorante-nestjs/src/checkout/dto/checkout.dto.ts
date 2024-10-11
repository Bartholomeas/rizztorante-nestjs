import { ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

import { PaymentsEnum, PickupEnum } from "../enums/checkout.enums";

export class CheckoutDto {
  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  lastName?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  street: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  houseNumber: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  city: string;

  @ApiProperty({ example: "00-000" })
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  @Matches(/^\d{2}-\d{3}$/)
  zipCode: string;

  @ApiProperty({ example: "+48123456789" })
  @IsString()
  @IsPhoneNumber()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  phoneNumber: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  deliveryInstructions?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.ON_SITE)
  @Transform(({ value, obj }) => (obj.pickupType === PickupEnum.DELIVERY ? value : undefined))
  tableNumber: number;

  @ApiProperty({ enum: PickupEnum })
  @IsEnum(PickupEnum)
  pickupType: PickupEnum;

  @ApiProperty({ enum: PaymentsEnum })
  @IsEnum(PaymentsEnum)
  paymentType: PaymentsEnum;
}
