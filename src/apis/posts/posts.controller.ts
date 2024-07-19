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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto, CreatePostResponseDto } from './dto/create-post.dto';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { DetailPostResponseDto } from './dto/detial-post.dto';
import { ApiException } from 'src/decorators/api-exception.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@LoginAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 게시글 작성
   */
  @Post()
  @HttpCode(200)
  @ApiSuccess(CreatePostResponseDto)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.postsService.createPost(createPostDto, user.idx);
  }

  /**
   * 게시글 조회
   */
  @ApiSuccess(DetailPostResponseDto)
  @ApiException(HttpStatus.NOT_FOUND, '게시글을 찾을 수 없습니다')
  @Get(':postIdx')
  getPost(@Param('postIdx') postIdx: number) {
    return this.postsService.getPost(postIdx);
  }

  /**
   * 게시글의 댓글 리스트 조회
   */
  @Get(':postIdx/comments')
  getComments() {}

  /**
   * 게시글 수정
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: '게시글 수정 시 댓글을 단 사용자에게 알림을 보냅니다',
  })
  @ApiException(HttpStatus.NOT_FOUND, '게시글을 찾을 수 없습니다')
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.postsService.updatePost(user, updatePostDto);
  }

  /**
   * 게시글 삭제
   */
  @ApiOperation({
    deprecated: true,
  })
  @Delete(':postIdx/delete')
  deletePost() {}
}
