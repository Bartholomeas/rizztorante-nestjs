import { ApiProperty } from "@nestjs/swagger";

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
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  lastName?: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  street: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  houseNumber: string;

  @ApiProperty()
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  city: string;

  @ApiProperty({ example: "00-000" })
  @IsString()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  @Matches(/^\d{2}-\d{3}$/)
  zipCode: string;

  @ApiProperty({ example: "123456789" })
  @IsString()
  @IsPhoneNumber()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  phoneNumber: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.DELIVERY)
  deliveryInstructions?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @ValidateIf(({ pickupType }) => pickupType === PickupEnum.ON_SITE)
  tableNumber: number;

  @ApiProperty({ enum: PickupEnum })
  @IsEnum(PickupEnum)
  pickupType: PickupEnum;

  @ApiProperty({ enum: PaymentsEnum })
  @IsEnum(PaymentsEnum)
  paymentType: PaymentsEnum;
}
