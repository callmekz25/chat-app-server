import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPlainText } from '@/utils/hashPlainText';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['providers'] });
  }

  async register(dto: CreateUserDto) {
    const passwordHashed = await hashPlainText(dto.password);
    const user = this.userRepository.create({
      email: dto.email,
      full_name: dto.full_name,
      user_name: dto.user_name,
      gender: dto.gender,
      providers: [
        {
          password: passwordHashed,
        },
      ],
    });
    return this.userRepository.save(user);
  }
}
