import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaskStatus } from '../../enums/TaskStatus';
import { IsObjectId } from '../../decorators/is-objectid.decorator';

export class UpdateTaskDto {
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
  assigneeId: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalMinutes: number;
}
