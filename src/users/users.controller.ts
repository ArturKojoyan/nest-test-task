import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { PermissionLevel } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('add-permission/:userId')
  async addPermissionToUser(
    @Body('permission') permission: PermissionLevel,
    @Param('userId') userId: string,
  ) {
    if (!userId) {
      return new BadRequestException('User ID is required');
    }
    if (!permission) {
      return new BadRequestException('Permission is required');
    }

    try {
      const data = await this.userService.addPermissionToUser(
        userId,
        permission,
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return new BadRequestException(
        `Failed to update user's permission with ID ${userId}`,
      );
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('remove-permission/:userId')
  async removePermissionFromUser(@Param('userId') userId: string) {
    if (!userId) {
      return new BadRequestException('User ID is required');
    }

    try {
      const data = await this.userService.removePermissionFromUser(userId);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return new BadRequestException(
        `Failed to remove permission from user with ID ${userId}`,
      );
    }
  }
}
