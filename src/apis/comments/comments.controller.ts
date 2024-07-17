import {
  Body,
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

@ApiTags('Comments')
@LoginAuth()
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
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: '댓글 작성 시 게시글의 작성자에게 알림을 보냅니다.',
  })
  @ApiSuccess(CreateCommentResponseDto)
  @ApiException(HttpStatus.NOT_FOUND, '해당하는 게시글이 존재하지 않습니다.')
  createComment(
    @Body() createComentDto: CreateCommentDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.commentsService.createComment(createComentDto, user.idx);
  }

  /**
   * 댓글 수정
   */
  @Put('update')
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
   * 댓글 삭제
   */
  @ApiOperation({
    deprecated: true,
  })
  @Delete('delete')
  deleteComment() {}
}
