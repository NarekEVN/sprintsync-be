import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    const user = await this.userService.findByEmail(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.user.email as string,
    );

    if (!user || !user.isAdmin) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
