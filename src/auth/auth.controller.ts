import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: CreateUserDto,
  ) {
    const { name, age, email, password, permissions, companyId } = body;

    // Validate input
    if (!name || !email || !password || !permissions || !companyId) {
      return new BadRequestException(
        'name, email, password, permissions and companyId fields are required',
      );
    }

    // Create the user
    const user = await this.usersService.create({
      name,
      email,
      password,
      companyId,
      permissions,
      age,
    });
    return {
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        permissions: user.permissions,
      },
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.authService.validateUser(body.email, body.password);
    console.log('🚀 ~ AuthController ~ login ~ user:', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
