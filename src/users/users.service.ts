import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PermissionLevel, User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with input email already exists');
    }

    const hashedPass = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPass,
    });
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    console.log('🚀 ~ UsersService ~ validateUser ~ user:', user);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passIsValid = bcrypt.compareSync(password, user.password);

    if (user && passIsValid) {
      return user;
    }
    return null;
  }

  async addPermissionToUser(
    userId: string,
    permission: PermissionLevel,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.permission = permission;
    return user.save();
  }

  async removePermissionFromUser(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.permission = PermissionLevel.READ; // Reset to default permission
    return user.save();
  }
}
