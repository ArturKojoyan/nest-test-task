import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Relationship with Company
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId; // Reference to the Company

  // Permissions for all projects owned by the company
  @Prop({ required: true, enum: PermissionLevel })
  permission: PermissionLevel;
}

export const UserSchema = SchemaFactory.createForClass(User);
