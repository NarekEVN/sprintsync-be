import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../schemas/task.schema';
import { GEMINI_PROVIDER_TOKEN } from '../constants';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [
    TasksService,
    {
      provide: GEMINI_PROVIDER_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new GoogleGenAI({
          apiKey: configService.get<string>('gemini.apiKey'),
        });
      },
    },
  ],
  controllers: [TasksController],
})
export class TasksModule {}
