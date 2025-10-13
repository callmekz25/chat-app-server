import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { hashPlainText } from '@/utils/hashPlainText';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, GetUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getById(userId: string) {
    return await this.userModel
      .findById(new Types.ObjectId(userId))
      .select('-providers')
      .lean();
  }

  async getByUserName(userName: string) {
    return this.userModel.findOne({ userName }).select('-providers').lean();
  }

  async updateFollower(
    userId: string,
    type: 'following' | 'follower',
    delta: number,
  ) {
    const field = type === 'following' ? 'totalFollowings' : 'totalFollowers';

    const user = await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(userId), {
        $inc: { [field]: delta },
      })
      .select('-providers');

    if (!user) {
      throw new UnauthorizedException();
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

  async findOne(object: Record<string, any>): Promise<User | null> {
    const result = await this.userModel
      .findOne(object)
      .populate('providers')
      .lean()
      .exec();
    return result as User | null;
  }

  async findAll(): Promise<GetUserDto[]> {
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

    const passwordHashed = await hashPlainText(dto.password);
    const user = this.userModel.create({
      ...dto,
      providers: [
        {
          password: passwordHashed,
        },
      ],
    });
    return (await user).save();
  }
}
