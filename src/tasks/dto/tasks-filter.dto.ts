import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from '../../decorators/is-objectid.decorator';

export class TasksFilterDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsObjectId()
  assigneeId?: string;
}
