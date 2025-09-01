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
  async getNote(user_id: string) {
    return await this.noteService.getByUserId(user_id);
  }

  async deleteNote(user_id: string) {
    return await this.noteService.deleteNote(user_id);
  }

  async addNote(user_id: string, content: string) {
    return await this.noteService.addNote(user_id, content);
  }

  async getMe(user_id: string) {
    if (!user_id) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }
    const user = await this.userService.getById(user_id);

    return {
      user,
    };
  }

  async getProfile(viewer_name: string, target_name: string) {
    const user = await this.userService.getByUserName(target_name);
    let relations: any = null;

    if (viewer_name) {
      relations = await this.followService.getRelations(
        viewer_name,
        target_name,
      );
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
