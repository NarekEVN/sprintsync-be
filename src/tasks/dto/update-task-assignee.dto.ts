import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from '../../decorators/is-objectid.decorator';
import { IsOptional } from 'class-validator';

export class UpdateTaskAssigneeDto {
  @ApiProperty({ type: String, nullable: true })
  @IsObjectId()
  @IsOptional()
  assigneeId?: string | null;
}
