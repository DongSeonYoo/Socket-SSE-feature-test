import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import {
  CreateReplyRepsonseDto,
  CreateReplyRequestDto,
} from './dto/create-reply.dto';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';

@ApiTags('Replies')
@Controller('replies')
@LoginAuth()
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  /**
   * 답글 작성
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(CreateReplyRepsonseDto)
  async createReply(
    @Body() createReplyRequestDto: CreateReplyRequestDto,
    @LoginUser() user: IAuth.IJwtPayload,
  ) {
    return this.repliesService.createReply(createReplyRequestDto, user.idx);
  }

  /**
   * 답글 정보 조회
   */
  @Get()
  getReplies() {}
}
