import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AddNoteDto } from '@/users/dtos/add-note-dto';

export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private noteModel: Model<NoteDocument>,
  ) {}
  async getByUserId(user_id: string) {
    const note = await this.noteModel
      .findOne({ user_id: new Types.ObjectId(user_id) })
      .lean<NoteDocument>();

    return {
      note,
    };
  }

  async addNote(user_id: string, content: string) {
    const note = (await this.noteModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(user_id) },
      {
        $set: {
          content,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
      {
        upsert: true,
        new: true,
        lean: true,
      },
    )) as AddNoteDto;

    return {
      note: note,
    };
  }

  async deleteNote(user_id: string) {
    await this.noteModel.deleteOne({
      user_id: new Types.ObjectId(user_id),
    });
    return {
      message: 'Xoá note',
    };
  }
}
