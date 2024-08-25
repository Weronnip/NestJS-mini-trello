import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'New Task', description: 'The task name' })
  @IsString()
  task_name: string;

  @ApiProperty({ example: false, description: 'Is the task completed?' })
  @IsBoolean()
  is_complected: boolean;

  @ApiProperty({
    example: '25.08.2024 09:34',
    description: 'At what time was it created',
  })
  @IsString()
  createAt: string;
}

export type TUpdateTaskDTO = Partial<CreateTaskDto>;
