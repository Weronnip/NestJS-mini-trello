/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { CreateTaskDto } from 'src/tasks/dto/task.dto';
import { CreateUserDto, TUpdateUserDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Req() @Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    console.log(id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUser(@Body() updateUserDTO: TUpdateUserDTO, @Param('id') id: number) {
    return this.usersService.patchUser(id, updateUserDTO);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: number) {
    this.usersService.deleteUser(id);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  deleteAll() {
    return this.usersService.AllDelete();
  }

  // Создание колонок через пользователя

  @Get(':id/columns')
  @UseGuards(JwtAuthGuard)
  async usersTasks(@Param('id') column_id: number) {
    const { tasks } = await this.usersService.userTaskAll(column_id);
    return { tasks };
  }
}
