import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passports/local-auth.guard';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      statusCode: res.statusCode,
      data: {
        message: 'Đăng nhập thành công',
        access_token,
      },
    });
  }

  @Post('register')
  async register(@Body() req: CreateUserDto) {
    return this.authService.register(req);
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const access_token = await this.authService.refreshToken(
      req.cookies?.['refresh_token'],
    );
    return {
      message: 'Refresh token',
      access_token,
    };
  }
}
