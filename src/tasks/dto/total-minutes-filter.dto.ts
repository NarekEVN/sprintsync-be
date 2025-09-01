import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from '../../decorators/is-objectid.decorator';
import { IsDefined } from 'class-validator';

export class TotalMinutesFilterDto {
  @ApiProperty({ type: String, required: true })
  @IsObjectId()
  @IsDefined()
  assigneeId: string;
}
