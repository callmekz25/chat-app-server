import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { hashPlainText } from '@/utils/hashPlainText';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getById(user_id: string) {
    return await this.userModel
      .findById(new Types.ObjectId(user_id))
      .select('-providers')
      .lean();
  }

  async getByUserName(user_name: string) {
    return this.userModel.findOne({ user_name }).select('-providers').lean();
  }

  async updateFollower(
    user_id: string,
    type: 'following' | 'follower',
    delta: number,
  ) {
    const field = type === 'following' ? 'total_followings' : 'total_followers';

    const user = await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(user_id), {
        $inc: { [field]: delta },
      })
      .select('-providers');

    if (!user) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    return true;
  }

  async findLocalByEmail(email: string) {
    return this.userModel
      .findOne({
        email,
        providers: { $elemMatch: { provider: 'local' } },
      })
      .lean();
  }
  async findOne(object: Record<string, any>) {
    return await this.userModel.findOne(object).populate('providers').lean();
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
    return (await user).save();
  }
}
