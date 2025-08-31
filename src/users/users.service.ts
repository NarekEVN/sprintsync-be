import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ _id: new ObjectId(userId) });
  }

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.userModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getCurrentUser(email: string): Promise<UserResponseDto> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }

  async softDeleteUserById(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      {
        deletedAt: new Date(),
      },
    );
  }

  async updateUser(
    userId: string,
    requestUserId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (requestUserId !== userId) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      updateUserDto,
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User does not exist');
    }

    return {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    };
  }
}
