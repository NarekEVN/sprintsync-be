import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'John', type: String, required: true })
  firstName: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'Doe', type: String, required: true })
  lastName: string;

  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com', type: String, required: true })
  email: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: '12345678', type: String, required: true })
  @MinLength(8)
  password: string;
}
