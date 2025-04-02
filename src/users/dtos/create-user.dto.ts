import {
  IsEmail,
  IsInt,
  IsObject,
  IsString,
  Length,
  Max,
  Min,
} from '@nestjs/class-validator';
import type { PermissionLevel } from 'src/schemas/user.schema';

export class CreateUserDto {
  @IsString()
  @Length(3, 25, { message: 'Name must be between 3 and 25 characters' })
  readonly name: string;

  @IsInt()
  @Min(14, { message: 'Age must be at least 14' })
  @Max(100, { message: 'Age must not exceed 100' })
  readonly age: number;

  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string;

  @IsString()
  @Length(8, 50, { message: 'Password must be between 6 and 44 characters' })
  readonly password: string;

  @IsString()
  readonly companyId: string;

  @IsObject()
  readonly permissions: Record<string, Array<PermissionLevel>>; // Adjusted to use string instead of PermissionLevel
}
