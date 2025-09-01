import { ApiProperty } from '@nestjs/swagger';

export class SuggestDescriptionResponseDto {
  @ApiProperty({ type: String })
  description: string;
}
