import { IsArray, IsEnum, IsString, Length } from '@nestjs/class-validator';
import { Status } from 'src/schemas/project.schema';

export class CreateProjectDto {
  @IsString()
  @Length(3, 25, { message: 'Name must be between 3 and 25 characters' })
  readonly name: string;

  @IsString()
  @Length(3, 200, {
    message: 'Description must be between 3 and 200 characters',
  })
  readonly description: string;

  @IsEnum(Status, { message: 'Invalid email address' })
  readonly status: string;

  @IsArray()
  @IsString({ each: true })
  readonly tags: Array<string>;
}
