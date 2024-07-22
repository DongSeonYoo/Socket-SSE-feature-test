import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Sse,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateCommentDto,
  CreateCommentResponseDto,
} from './dto/create-comment.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { ApiException } from 'src/decorators/api-exception.decorator';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IComment } from './entities/comment.entity';
import { CommentListResponseDto } from './dto/comment-list.dto';
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';

@ApiTags('Comments')
@LoginAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 게시글의 댓글 리스트 조회
   */
  @Get(':postIdx')
  @ApiSuccess([CommentListResponseDto])
  @ApiException(HttpStatus.NOT_FOUND, '해당하는 게시글이 존재하지 않습니다.')
  getComments(
    @Param('postIdx') postIdx: number,
    @Query() pageNate: PagenationRequestDto,
  ) {
    return this.commentsService.getComments(postIdx, pageNate);
  }

  /**
   * 댓글 작성
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: '댓글 작성 시 게시글의 작성자에게 알림을 보냅니다.',
  })
  @ApiSuccess(CreateCommentResponseDto)
  @ApiException(HttpStatus.NOT_FOUND, '해당하는 게시글이 존재하지 않습니다.')
  async createComment(
    @Body() createComentDto: CreateCommentDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    const createCommentResult = await this.commentsService.createComment(
      createComentDto,
      user.idx,
    );

    return createCommentResult;
  }

  /**
   * 댓글 수정
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: '댓글 작성 시 게시글의 작성자에게 알림을 보냅니다.',
  })
  updateComment(
    @Body() updatecommentDto: UpdateCommentDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.commentsService.updateComment(updatecommentDto, user.idx);
  }

  /**
   * 답글 리스트 조회
   */
  @Get(':commentIdx/replies')
  getReplies(@Param() commentIdx: IComment['idx']) {
    return this.commentsService.getReplies(commentIdx);
  }

  /**
   * 댓글 삭제
   */
  @ApiOperation({
    deprecated: true,
  })
  @Delete('delete')
  deleteComment() {}
}
