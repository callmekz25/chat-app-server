import { UserService } from '@/modules/users/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareHash } from '@/utils/compareHash';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@/modules/users/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload';
import { CreateUserDto } from '@/modules/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findLocalByEmail(email);

    const isMatch = await compareHash(password, user?.providers[0].password);
    if (!user || !isMatch) {
      return null;
    }
    return user;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }
    let user: User | null = null;
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      user = await this.userService.findOne({ _id: payload.sub });
    } catch {
      throw new UnauthorizedException('Token không hợp lệ!!');
    }
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id.toString(),
      email: user.email,
      userName: user.userName,
    });
    return accessToken;
  }

  async login(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      userName: user.userName,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: CreateUserDto) {
    await this.userService.create(dto);
    return {
      message: 'Đăng ký thành công',
    };
  }
}
