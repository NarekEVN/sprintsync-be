import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../enums/TaskStatus';
import { IsDefined, IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({ type: String, enumName: 'TaskStatus' })
  @IsEnum(TaskStatus)
  @IsDefined()
  status: TaskStatus;
}
