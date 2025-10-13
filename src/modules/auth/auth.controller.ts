import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passports/local-auth.guard';
import { type Request, type Response } from 'express';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from '@/modules/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Đăng nhập thành công', accessToken };
  }

  @Public()
  @Post('register')
  async register(@Body() req: CreateUserDto) {
    return this.authService.register(req);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const accessToken = await this.authService.refreshToken(
      req.cookies?.['refreshToken'],
    );
    return {
      message: 'Refresh token',
      accessToken,
    };
  }
}
