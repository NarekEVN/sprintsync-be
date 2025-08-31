import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';
import { RequestUser } from '../types/RequestUser';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getCurrentUser(@CurrentUser() user: RequestUser): Promise<UserResponseDto> {
    return this.userService.getCurrentUser(user.email);
  }
}
