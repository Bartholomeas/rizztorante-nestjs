import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, IsStrongPassword, IsEnum } from "class-validator";

import { EmployeeRole } from "@common/types/employee-roles.type";

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;

  @ApiProperty({ enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  role: EmployeeRole;
}
