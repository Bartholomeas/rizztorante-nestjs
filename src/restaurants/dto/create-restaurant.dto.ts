import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
