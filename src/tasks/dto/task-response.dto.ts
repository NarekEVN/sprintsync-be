import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../enums/TaskStatus';
import { User } from '../../schemas/user.schema';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class TaskResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;

  @ApiProperty({ type: User })
  creator: UserResponseDto;

  @ApiProperty({ type: User, nullable: true })
  assignee: UserResponseDto | null;

  @ApiProperty({ type: Number })
  totalMinutes: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
