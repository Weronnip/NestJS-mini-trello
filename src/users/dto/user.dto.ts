import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex', description: 'example username' })
  @IsString({
    message: 'A string cannot be another data type',
  })
  username: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'example email',
  })
  @IsString({
    message: 'A string cannot be another data type',
  })
  email: string;

  @ApiProperty({ example: 'fortFocus2', description: 'example password' })
  @IsString({
    message: 'A string cannot be another data type',
  })
  password: string;
}

export type TUpdateUserDTO = Partial<CreateUserDto>;
