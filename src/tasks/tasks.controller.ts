import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { CreateTaskDto, TUpdateTaskDTO } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTask(@Req() @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patchTask(@Param('id') id: number, @Body() updateTask: TUpdateTaskDTO) {
    return this.tasksService.patchTask(id, updateTask);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteTaskAll() {
    return this.tasksService.deleteTaskAll();
  }
}
