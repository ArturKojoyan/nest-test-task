import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.usersService.validateUser(email, password);
  }

  login(user: User) {
    const payload = {
      email: user.email,
      name: user.name,
      permissions: user.permissions,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
