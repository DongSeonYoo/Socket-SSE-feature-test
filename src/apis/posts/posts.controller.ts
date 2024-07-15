import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 게시글 작성
   */
  @Post()
  createPost() {}

  /**
   * 게시글 조회
   */
  @Get(':postIdx')
  getPost() {}

  /**
   * 게시글의 댓글 리스트 조회
   */
  @Get(':postIdx/comments')
  getComments() {}

  /**
   * 게시글 수정
   */
  @ApiOperation({
    description: '게시글 수정 시 댓글을 단 사용자에게 알림을 보냅니다',
  })
  @Put(':postIdx')
  updatePost() {}

  /**
   * 게시글 삭제
   */
  @Delete(':postIdx/delete')
  deletePost() {}
}
