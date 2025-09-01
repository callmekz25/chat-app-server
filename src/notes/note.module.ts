import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],

  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
