import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@example.com', type: String, required: true })
  email: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: '12345678', type: String, required: true })
  password: string;
}
