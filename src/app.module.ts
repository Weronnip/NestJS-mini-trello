import * as dotenv from 'dotenv';
import * as schema from './schema';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { CardsModule } from './cards/cards.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';

dotenv.config({ path: '.env' });

@Module({
  imports: [
    UsersModule,
    TasksModule,
    CardsModule,
    CommentModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleMySqlModule.register({
      tag: 'DB_TRELLO',
      mysql: {
        connection: 'client',
        config: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER || 'root',
          database: process.env.DB_NAME || 'MyTrello',
          password: process.env.DB_PASSWORD || 'demofort',
          port: 3306,
        },
      },
      config: { schema: { ...schema }, mode: 'default' },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
