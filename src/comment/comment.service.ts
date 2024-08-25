import { eq } from 'drizzle-orm';
import * as schema from '../schema';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateCommentDto, TUpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('DB_TRELLO') private drizzleTrello: MySql2Database<typeof schema>,
  ) {}

  async findAll() {
    const comments = await this.drizzleTrello.query.Comments.findMany();
    return {
      comments,
    };
  }

  async findOne(id: number) {
    const comment = await this.drizzleTrello
      .select()
      .from(schema.Comments)
      .where(eq(schema.Comments.comment_id, id));
    return {
      comment,
    };
  }

  async createComment(createCommentDto: CreateCommentDto) {
    const [new_comment] = await this.drizzleTrello
      .insert(schema.Comments)
      .values({
        comment_name: createCommentDto.comment_name,
        create_at: createCommentDto.createAt,
      });

    const newCommentID = new_comment.insertId;
    const [newComment] = await this.drizzleTrello
      .select()
      .from(schema.Comments)
      .where(eq(schema.Comments.comment_id, newCommentID))
      .limit(1);
    return {
      newComment,
    };
  }

  async patchComment(id: number, updateCommentDto: TUpdateCommentDto) {
    if (id == null || isNaN(id)) {
      throw new Error('Invalid comment id');
    }

    if (updateCommentDto.comment_name) {
      updateCommentDto.comment_name = updateCommentDto.comment_name;
    }

    if (updateCommentDto.createAt) {
      updateCommentDto.createAt = updateCommentDto.createAt;
    }

    const [updateComment] = await this.drizzleTrello
      .update(schema.Comments)
      .set(updateCommentDto)
      .where(eq(schema.Comments.comment_id, id));

    return {
      updateComment,
    };
  }

  async deleteComment(id: number) {
    const deleteComment = await this.drizzleTrello
      .delete(schema.Comments)
      .where(eq(schema.Comments.comment_id, id));
    return {
      deleteComment,
    };
  }

  async deleteComments() {
    const deleteComments = await this.drizzleTrello.delete(schema.Comments);
    return {
      deleteComments,
    };
  }
}
