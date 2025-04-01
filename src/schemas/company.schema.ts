import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop()
  industry: string;

  // Relationship with Users
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[]; // Array of User IDs

  // Relationship with Projects
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Types.ObjectId[]; // Array of Project IDs
}

export const CompanySchema = SchemaFactory.createForClass(Company);
