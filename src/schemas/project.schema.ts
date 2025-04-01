import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

export enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export enum Status {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  status: Status;

  @Prop()
  priority: Priority;

  @Prop()
  tags: Array<string>;

  // Relationship with Company
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId[]; // Reference to the Company
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
