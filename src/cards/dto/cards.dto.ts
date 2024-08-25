import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCardsDto {
  @ApiProperty({ example: 'Buy new pc', description: 'example name cards' })
  @IsString({
    message: 'this row is string',
  })
  cards_name: string;

  @ApiProperty({
    example: '25.08.2024 09:45',
    description: 'example post comments',
  })
  @IsString({
    message: 'this row is string',
  })
  createAt: string;
}

export type TUpdateCardsDto = Partial<CreateCardsDto>;
