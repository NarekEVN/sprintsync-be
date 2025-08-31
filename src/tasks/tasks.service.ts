import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ObjectId } from 'mongodb';
import { TasksFilterDto } from './dto/tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskAssigneeDto } from './dto/update-task-assignee.dto';
import { UpdateTaskLogTimeDto } from './dto/update-task-logtime.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SuggestDescriptionDto } from './dto/suggest-description.dto';
import { GEMINI_PROVIDER_TOKEN } from '../constants';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @Inject(GEMINI_PROVIDER_TOKEN) private readonly gemini: GoogleGenAI,
  ) {}

  async createTask(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskModel.insertOne({
      title: createTaskDto.title,
      description: createTaskDto?.description,
      status: createTaskDto.status,
      assignee: createTaskDto.assigneeId
        ? new ObjectId(createTaskDto.assigneeId)
        : null,
      creator: new ObjectId(userId),
    });

    return this.sanitizeTask(task);
  }

  async getTasks(queryFilters: TasksFilterDto): Promise<TaskResponseDto[]> {
    const match = {
      ...(queryFilters.assigneeId && {
        assignee: new ObjectId(queryFilters.assigneeId),
      }),
    };

    const tasks = await this.taskModel
      .find(match)
      .populate(['assignee', 'creator']);

    return tasks.map((task) => this.sanitizeTask(task));
  }

  private sanitizeTask(task: Task): TaskResponseDto {
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      totalMinutes: task.totalMinutes,
      assignee: task.assignee
        ? {
            id: task.assignee._id.toString(),
            firstName: task.assignee.firstName,
            lastName: task.assignee.lastName,
            email: task.assignee.email,
            isAdmin: task.assignee.isAdmin,
          }
        : null,
      creator: {
        id: task.creator._id.toString(),
        firstName: task.creator.firstName,
        lastName: task.creator.lastName,
        email: task.creator.email,
        isAdmin: task.creator.isAdmin,
      },
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.taskModel.findOne({ _id: new ObjectId(taskId) });
  }

  async updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }

    const updatedTask = await this.taskModel
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          status: updateTaskStatusDto.status,
        },
        { new: true },
      )
      .populate(['assignee', 'creator']);

    return this.sanitizeTask(updatedTask as Task);
  }

  async updateTaskAssignee(
    taskId: string,
    updateTaskAssigneeDto: UpdateTaskAssigneeDto,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }

    const updatedTask = await this.taskModel
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          assignee: updateTaskAssigneeDto.assigneeId
            ? new ObjectId(updateTaskAssigneeDto.assigneeId)
            : null,
        },
        { new: true },
      )
      .populate(['assignee', 'creator']);

    return this.sanitizeTask(updatedTask as Task);
  }

  async updateTaskWorkMinutes(
    taskId: string,
    updateTaskLogTimeDto: UpdateTaskLogTimeDto,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }

    const updatedTask = await this.taskModel
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          totalMinutes: updateTaskLogTimeDto.minutes,
        },
        { new: true },
      )
      .populate(['assignee', 'creator']);

    return this.sanitizeTask(updatedTask as Task);
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task does not exist');
    }

    const updatedTask = await this.taskModel
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        {
          title: updateTaskDto.title,
          status: updateTaskDto.status,
          ...(updateTaskDto.description && {
            description: updateTaskDto.description,
          }),
          ...(updateTaskDto.assigneeId
            ? {
                assignee: new ObjectId(updateTaskDto.assigneeId),
              }
            : { assignee: null }),
        },
        { new: true },
      )
      .populate(['assignee', 'creator']);

    return this.sanitizeTask(updatedTask as Task);
  }

  async suggestDescriptionWithAi(
    suggestDescriptionDto: SuggestDescriptionDto,
  ): Promise<string> {
    const prompt = `
      You are a senior software engineer. Given a ticket title, write a well-structured,
      detailed Jira-style ticket description.
  
      Ticket Title: ${suggestDescriptionDto.title}
  
      Follow this structure:
      1. **Summary**: Short high-level overview
      2. **Background/Context**: Why this is needed
      3. **Acceptance Criteria**: Bullet points of clear success conditions
      4. **Technical Notes**: Implementation details, dependencies, risks
      5. **Out of Scope**: What is explicitly not included
    `;

    const response = await this.gemini.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a senior software engineer writing Jira tickets.',
      },
    });

    return response.text as string;
  }
}
