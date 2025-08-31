import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('signup')
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async signup(@Body() body: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signUp(body);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }
}
