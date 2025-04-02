import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum PermissionLevel {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN',
}
type Permissions = Record<string, Array<PermissionLevel>>;

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

  // Permissions for all projects owned by the company
  @Prop({ required: true, type: Object })
  permissions: Permissions;
}

export const UserSchema = SchemaFactory.createForClass(User);
