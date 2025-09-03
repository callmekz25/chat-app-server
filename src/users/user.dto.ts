import { IsEmail, IsNotEmpty } from 'class-validator';
import { Gender } from './user.schema';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email không được trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Biệt danh không được trống' })
  user_name: string;

  @IsNotEmpty({ message: 'Họ tên không được trống' })
  full_name: string;

  @IsNotEmpty({ message: 'Giới tính không được trống' })
  gender: Gender;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  password: string;
}
