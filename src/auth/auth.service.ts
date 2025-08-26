import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UserService } from '@/users/user.service';
import { Injectable } from '@nestjs/common';
import { compareHash } from '@/utils/compareHash';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findLocalByEmail(email);

    const isMatch = await compareHash(password, user?.providers[0].password);
    if (!user || !isMatch) {
      return null;
    }
    return user;
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    delete user.providers[0].password;
    return {
      message: 'Đăng nhập thành công',
      access_token,
    };
  }

  async register(dto: CreateUserDto) {
    await this.userService.create(dto);
    return {
      message: 'Đăng ký thành công',
    };
  }
}
