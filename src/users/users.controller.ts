import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { PermissionLevel } from 'src/schemas/user.schema';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('/:userId/add-permission/companies/:companyId')
  async addPermissionToUser(
    @Body('permission') permission: PermissionLevel,
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    if (!userId) {
      return new BadRequestException('User ID is required');
    }
    if (!permission || !companyId) {
      return new BadRequestException('permission and companyId are required');
    }

    const data = await this.userService.addPermissionToUser(
      userId,
      companyId,
      permission,
    );
    return { data, message: 'Permission added successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('/:userId/remove-permission/companies/:companyId')
  async removePermissionFromUser(
    @Body('permission') permission: PermissionLevel,
    @Param('userId') userId: string,
    @Param('companyId') companyId: string,
  ) {
    if (!userId) {
      return new BadRequestException('User ID is required');
    }

    const data = await this.userService.removePermissionFromUser(
      userId,
      companyId,
      permission,
    );
    return { data, message: 'Permission removed successfully' };
  }
}
