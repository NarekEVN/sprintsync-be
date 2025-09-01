import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { RequestUser } from '../types/RequestUser';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: RequestUser): Promise<UserResponseDto> {
    return this.userService.getCurrentUser(user.email);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':userId')
  deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.userService.softDeleteUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  updateUser(
    @Param('userId') userId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(userId, user.userId, body);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }
}
