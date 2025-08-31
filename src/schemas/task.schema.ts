import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from '../enums/TaskStatus';
import { User } from './user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, enum: TaskStatus })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  creator: User;

  @Prop({ type: Types.ObjectId, ref: 'User', nullable: true })
  assignee: User;

  @Prop({ type: Number, default: 0 })
  totalMinutes: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
