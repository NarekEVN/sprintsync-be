import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RequestUser } from '../types/RequestUser';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';
import { UpdateTaskLogTimeDto } from './dto/update-task-logtime.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SuggestDescriptionDto } from './dto/suggest-description.dto';
import { SuggestDescriptionResponseDto } from './dto/suggest-description-response.dto';
import { TotalMinutesFilterDto } from './dto/total-minutes-filter.dto';
import { TotalMinutesResponseDto } from './dto/total-minutes-response.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  createTask(@CurrentUser() user: RequestUser, @Body() body: CreateTaskDto) {
    return this.taskService.createTask(user.userId, body);
  }

  @Get()
  getTasks(@Query() query: TasksFilterDto): Promise<TaskResponseDto[]> {
    return this.taskService.getTasks(query);
  }

  @Patch(':taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTaskStatus(taskId, body);
  }

  @Patch(':taskId/assignee')
  updateTaskAssignee(
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskAssigneeDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTaskAssignee(taskId, body);
  }

  @Patch(':taskId/time')
  updateTaskWorkMinutes(
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskLogTimeDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTaskWorkMinutes(taskId, body);
  }

  @Put(':taskId')
  updateTask(
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.taskService.updateTask(taskId, body);
  }

  @Post('ai/suggest')
  async suggestDescription(
    @Body() body: SuggestDescriptionDto,
  ): Promise<SuggestDescriptionResponseDto> {
    const response = await this.taskService.suggestDescriptionWithAi(body);
    return { description: response };
  }

  @Get('/total-minutes')
  getTotalMinutesByAssignee(
    @Query() query: TotalMinutesFilterDto,
  ): Promise<TotalMinutesResponseDto> {
    return this.taskService.getTotalMinutesByAssignee(query);
  }
}
