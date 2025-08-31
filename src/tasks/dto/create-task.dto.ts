import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../enums/TaskStatus';
import { IsObjectId } from '../../decorators/is-objectid.decorator';

export class CreateTaskDto {
  @ApiProperty({ type: String })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String, enumName: 'TaskStatus' })
  @IsDefined()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsObjectId()
  assigneeId?: string;
}
