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
  async getByUserId(userId: string) {
    return await this.noteModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .lean<NoteDocument>();
  }

  async addNote(userId: string, content: string) {
    await this.noteModel.deleteOne({ userId: new Types.ObjectId(userId) });

    const note = await this.noteModel.create({
      userId: new Types.ObjectId(userId),
      content,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      note: note.toObject(),
    };
  }

  async deleteNote(userId: string) {
    await this.noteModel.deleteOne({
      userId: new Types.ObjectId(userId),
    });
    return {
      message: 'Xoá note',
    };
  }
}
