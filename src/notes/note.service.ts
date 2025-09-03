import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private noteModel: Model<NoteDocument>,
  ) {}
  async getByUserId(user_id: string) {
    return await this.noteModel
      .findOne({ user_id: new Types.ObjectId(user_id) })
      .lean<NoteDocument>();
  }

  async addNote(user_id: string, content: string) {
    await this.noteModel.deleteOne({ user_id: new Types.ObjectId(user_id) });

    const note = await this.noteModel.create({
      user_id: new Types.ObjectId(user_id),
      content,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      note: note.toObject(),
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
