import { eq } from 'drizzle-orm';
import * as schema from '../schema';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto, TUpdateTaskDTO } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject('DB_TRELLO') private drizzleTrello: MySql2Database<typeof schema>,
  ) {}

  async findAll() {
    const tasks = await this.drizzleTrello.query.ColumnsTask.findMany();
    return {
      tasks,
    };
  }

  async findOne(id: number) {
    const task = await this.drizzleTrello
      .select()
      .from(schema.ColumnsTask)
      .where(eq(schema.ColumnsTask.task_id, id));
    return {
      task: task,
    };
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const [newTask] = await this.drizzleTrello
      .insert(schema.ColumnsTask)
      .values({
        task_name: createTaskDto.task_name,
        is_complected: createTaskDto.is_complected,
        create_at: createTaskDto.createAt,
      });
    const newTaskID = newTask.insertId;
    const [new_task] = await this.drizzleTrello
      .select()
      .from(schema.ColumnsTask)
      .where(eq(schema.ColumnsTask.task_id, newTaskID))
      .limit(1);
    return {
      new_task,
    };
  }

  async patchTask(id: number, updateTaskDto: TUpdateTaskDTO) {
    console.log('\nReceived updateTaskDto:', updateTaskDto);

    if (id == null || isNaN(id)) {
      throw new Error('Invalid task id');
    }

    if (!updateTaskDto) {
      throw new Error('No data to update');
    }
    if (updateTaskDto.task_name) {
      updateTaskDto.task_name = updateTaskDto.task_name;
    }

    if (updateTaskDto.is_complected) {
      updateTaskDto.is_complected = updateTaskDto.is_complected;
    }

    if (updateTaskDto.createAt) {
      updateTaskDto.createAt = updateTaskDto.createAt;
    }

    console.log('\nUpdating task with ID:', id);
    console.log('Update data:', updateTaskDto, '\n');

    const [updateTask] = await this.drizzleTrello
      .update(schema.ColumnsTask)
      .set(updateTaskDto)
      .where(eq(schema.ColumnsTask.task_id, id));
    return {
      updateTask,
    };
  }

  async deleteTask(id: number) {
    const [deleteTask] = await this.drizzleTrello
      .delete(schema.ColumnsTask)
      .where(eq(schema.ColumnsTask.task_id, id));
    return {
      deleteTask,
    };
  }

  async deleteTaskAll() {
    const [deleteTaskAll] = await this.drizzleTrello.delete(schema.ColumnsTask);
    return {
      deleteTaskAll,
    };
  }
}
