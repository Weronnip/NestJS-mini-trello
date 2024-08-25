import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guards';
import { CommentService } from './comment.service';
import { CreateCommentDto, TUpdateCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createComment(@Req() @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(id: number) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  patchComments(
    @Param('id') id: number,
    @Body() updateCommentDto: TUpdateCommentDto,
  ) {
    return this.commentService.patchComment(id, updateCommentDto);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  deleteComments() {
    return this.commentService.deleteComments();
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param('id') id: number) {
    return this.commentService.deleteComment(id);
  }
}
