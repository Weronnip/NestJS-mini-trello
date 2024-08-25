import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Hi! your code nice!',
    description: 'example comments',
  })
  @IsString({
    message: 'this row is string',
  })
  comment_name: string;

  @ApiProperty({
    example: '25.08.2024 09:45',
    description: 'example post comments',
  })
  @IsString({
    message: 'this row is string',
  })
  createAt: string;
}

export type TUpdateCommentDto = Partial<CreateCommentDto>;
