import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestDescriptionDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  title: string;
}
