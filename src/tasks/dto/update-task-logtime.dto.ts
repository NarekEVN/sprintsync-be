import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskLogTimeDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  minutes: number;
}
