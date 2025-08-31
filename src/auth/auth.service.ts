import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (
      user &&
      (await this.userService.validatePassword(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async signUp(signupDto: SignupDto): Promise<AuthResponseDto> {
    const existingUser = await this.userService.findByEmail(signupDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.createUser(
      signupDto.firstName,
      signupDto.lastName,
      signupDto.email,
      signupDto.password,
    );

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: User): Promise<AuthResponseDto> {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userService.updateRefreshToken(userId, refreshToken);
  }

  async login({ email, password }: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User with this email does not exist');
    }

    if (!(await this.userService.validatePassword(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async refreshToken({
    refreshToken,
  }: RefreshTokenDto): Promise<AuthResponseDto> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });

    const user = await this.userService.findById(payload?.sub);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }
}
