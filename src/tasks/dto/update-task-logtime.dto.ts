import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskLogTimeDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  minutes: number;
}
