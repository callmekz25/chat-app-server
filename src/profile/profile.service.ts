import { FollowService } from '@/follows/follow.service';
import { NoteService } from '@/notes/note.service';
import { UserService } from '@/users/user.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly noteService: NoteService,
    private readonly followService: FollowService,
  ) {}
  async getNote(userId: string) {
    return await this.noteService.getByUserId(userId);
  }

  async deleteNote(userId: string) {
    return await this.noteService.deleteNote(userId);
  }

  async addNote(userId: string, content: string) {
    return await this.noteService.addNote(userId, content);
  }

  async getMe(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }
    const user = await this.userService.getById(userId);

    return {
      user,
    };
  }

  async getProfile(viewerName: string, targetName: string) {
    console.log(targetName);

    const user = await this.userService.getByUserName(targetName);
    let relations;

    if (viewerName) {
      relations = await this.followService.getRelations(viewerName, targetName);
    }

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const note = await this.noteService.getByUserId(user._id.toString());

    return {
      message: 'Lấy thông tin thành công',
      user,
      relations: relations,
      note: note,
    };
  }
}
