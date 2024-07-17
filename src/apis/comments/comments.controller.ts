import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 정보 조회
   */
  @Get(':commentIdx')
  getComments() {}

  /**
   * 댓글 작성
   */
  @ApiOperation({
    description: '댓글 작성 시 게시글의 작성자에게 알림을 보냅니다.',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  createComment() {}

  /**
   * 댓글 수정
   */
  @ApiOperation({
    description: '댓글 작성 시 게시글의 작성자에게 알림을 보냅니다.',
  })
  @Put('update')
  updateComment() {}

  /**
   * 댓글 삭제
   */
  @ApiOperation({
    deprecated: true,
  })
  @Delete('delete')
  deleteComment() {}
}
