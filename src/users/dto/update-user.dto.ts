import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsDefined()
  firstName: string;

  @ApiProperty()
  @IsDefined()
  lastName: string;

  @ApiProperty()
  @IsDefined()
  email: string;
}
