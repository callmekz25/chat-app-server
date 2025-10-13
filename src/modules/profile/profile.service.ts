import { UserService } from '@/modules/users/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  async getMe(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }
    const user = await this.userService.getById(userId);

    return {
      user,
    };
  }
}
