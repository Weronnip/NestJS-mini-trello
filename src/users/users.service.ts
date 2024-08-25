/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq } from 'drizzle-orm';
import * as schema from '../schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Inject, Injectable } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/task.dto';
import { CreateUserDto, TUpdateUserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DB_TRELLO') private drizzleTrello: MySql2Database<typeof schema>,
    private readonly TasksService: TasksService,
  ) {}

  async findAll() {
    const users = await this.drizzleTrello.query.Users.findMany();
    return {
      users: users,
    };
  }

  async findOne(id: number) {
    const user = await this.drizzleTrello
      .select()
      .from(schema.Users)
      .where(eq(schema.Users.user_id, id));
    return {
      user,
    };
  }

  async findOneByUser(email: string): Promise<any> {
    console.log(`Checking for username: ${email}`);
    const [user] = await this.drizzleTrello
      .select()
      .from(schema.Users)
      .where(eq(schema.Users.email, email))
      .limit(1);

    console.log(`\nFound user: ${user ? JSON.stringify(user) : 'none'}`);
    return user || null;
  }

  async createUser(createUserDto: CreateUserDto) {
    const [new_users] = await this.drizzleTrello.insert(schema.Users).values({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    const newUserID = new_users.insertId;
    const [newUser] = await this.drizzleTrello
      .select()
      .from(schema.Users)
      .where(eq(schema.Users.user_id, newUserID))
      .limit(1);
    return {
      newUser,
    };
  }

  async patchUser(id: number, updateUserDto: TUpdateUserDTO) {
    if (id == null || isNaN(id)) {
      throw new Error('Invalid task id');
    }

    if (!updateUserDto) {
      throw new Error('No data to update');
    }

    if (updateUserDto.username) {
      updateUserDto.username = updateUserDto.username;
    }

    if (updateUserDto.email) {
      updateUserDto.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      updateUserDto.password = updateUserDto.password;
    }

    const [updateUser] = await this.drizzleTrello
      .update(schema.Users)
      .set(updateUserDto)
      .where(eq(schema.Users.user_id, id));
    return {
      updateUser,
    };
  }

  async deleteUser(id: number) {
    const deleteUser = await this.drizzleTrello
      .delete(schema.Users)
      .where(eq(schema.Users.user_id, id));
    return {
      deleteUser,
    };
  }

  async AllDelete() {
    const deleteAllUser = await this.drizzleTrello.delete(schema.Users);
    return {
      deleteAllUser,
    };
  }

  // Задачи пользователя

  async userTaskAll(column_id: number) {
    try {
      const tasks = await this.drizzleTrello
        .select({ tasks: schema.ColumnsTask.task_name })
        .from(schema.ColumnsTask)
        .where(eq(schema.ColumnsTask.user_id, column_id));

      console.log('Fetched tasks:', tasks);
      return { tasks };
    } catch (error) {
      console.log('Error fetching task names:', error);
      throw new Error('Failed to fetch task names');
    }
  }
}
