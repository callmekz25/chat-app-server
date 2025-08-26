import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPlainText } from '@/utils/hashPlainText';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).lean<UserDocument>();
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }
    const { providers, ...result } = user;
    return {
      message: 'Lấy thông tin thành công',
      user: result,
    };
  }

  async findLocalByEmail(email: string) {
    return this.userModel
      .findOne({
        email,
        providers: { $elemMatch: { provider: 'local' } },
      })
      .lean();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().populate('providers');
  }
  async isEmailExist(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    if (user) {
      return true;
    }
    return false;
  }

  async create(dto: CreateUserDto) {
    const isEmailExist = await this.isEmailExist(dto.email);
    if (isEmailExist) {
      throw new ConflictException('Email đã tồn tại');
    }
    const { email, full_name, user_name, gender, password } = dto;
    const passwordHashed = await hashPlainText(password);
    const user = this.userModel.create({
      email,
      full_name,
      user_name,
      gender,
      providers: [
        {
          password: passwordHashed,
        },
      ],
    });
    (await user).save();
    return 'Đăng ký thành công';
  }
}
