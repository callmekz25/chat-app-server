import { IsNotEmpty } from 'class-validator';

export class AddNoteDto {
  @IsNotEmpty({ message: 'Nội dung note không được trống' })
  content: string;
}
