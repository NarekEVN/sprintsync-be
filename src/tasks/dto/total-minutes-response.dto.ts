import { ApiProperty } from '@nestjs/swagger';

export class TotalMinutesResponseDto {
  @ApiProperty({ type: Number })
  totalMinutes: number;
}
