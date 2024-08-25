import { relations } from 'drizzle-orm';
import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';

// Таблица Users
export const Users = mysqlTable('User', {
  user_id: int('user_id').primaryKey().autoincrement(),
  username: varchar('username', { length: 80 }),
  email: varchar('email', { length: 80 }),
  password: varchar('password', { length: 15000 }),
});

// Таблица ColumnsTask
export const ColumnsTask = mysqlTable('ColumnsTask', {
  task_id: int('task_id').primaryKey().autoincrement(),
  task_name: varchar('task_name', { length: 100 }),
  isCompleted: boolean('is_completed').default(false),
  createAt: timestamp('create_at', { mode: 'string' }).defaultNow(),
  user_id: int('user_id').references(() => Users.user_id, {
    onDelete: 'cascade',
  }),
});

// Таблица Cards
export const Cards = mysqlTable('Cards', {
  cards_id: int('cards_id').primaryKey().autoincrement(),
  cards_name: varchar('cards_name', { length: 50 }),
  cards_description: varchar('cards_description', { length: 3000 }),
  createAt: timestamp('create_at', { mode: 'string' }).defaultNow(),
  user_id: int('user_id').references(() => Users.user_id, {
    onDelete: 'cascade',
  }),
  task_id: int('task_id').references(() => ColumnsTask.task_id, {
    onDelete: 'cascade',
  }),
});

// Таблица Comments
export const Comments = mysqlTable('Comments', {
  comment_id: int('comment_id').primaryKey().autoincrement(),
  comment_name: varchar('comment_name', { length: 300 }),
  createAt: timestamp('create_at', { mode: 'string' }).defaultNow(),
  user_id: int('user_id').references(() => Users.user_id, {
    onDelete: 'cascade',
  }),
  cards_id: int('cards_id').references(() => Cards.cards_id, {
    onDelete: 'cascade',
  }),
});

// Связи таблицы Users
export const userRelations = relations(Users, ({ many }) => ({
  tasks: many(ColumnsTask),
  cards: many(Cards),
  comments: many(Comments),
}));

// Связи таблицы ColumnsTask
export const columnsTaskRelations = relations(ColumnsTask, ({ one, many }) => ({
  user: one(Users, {
    fields: [ColumnsTask.task_id],
    references: [Users.user_id],
  }),
  cards: many(Cards),
}));

// Связи таблицы Cards
export const cardsRelations = relations(Cards, ({ one, many }) => ({
  task: one(ColumnsTask, {
    fields: [Cards.task_id],
    references: [ColumnsTask.task_id],
  }),
  author: one(Users, {
    fields: [Cards.user_id],
    references: [Users.user_id],
  }),
  comments: many(Comments),
}));

// Связи таблицы Comments
export const commentsRelations = relations(Comments, ({ one }) => ({
  card: one(Cards, {
    fields: [Comments.cards_id],
    references: [Cards.cards_id],
  }),
  user: one(Users, {
    fields: [Comments.user_id],
    references: [Users.user_id],
  }),
}));
