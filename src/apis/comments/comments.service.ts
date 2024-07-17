import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCommentDto,
  CreateCommentResponseDto,
} from './dto/create-comment.dto';
import { IUser } from '../users/entities/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly logger: Logger = new Logger(CommentsService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 댓글 생성 프로세스
   * 1. 게시글이 존재하는지 확인
   * 2. 댓글 생성
   * 3. 댓글 생성 시 게시글 작성자에게 알림 전송
   */
  async createComment(
    createCommmetDto: CreateCommentDto,
    userIdx: IUser['idx'],
  ): Promise<CreateCommentResponseDto> {
    const checkExistPost = await this.prismaService.post.findUnique({
      where: {
        idx: createCommmetDto.postIdx,
      },
    });

    if (!checkExistPost) {
      throw new NotFoundException('해당하는 게시글이 존재하지 않습니다.');
    }

    return this.prismaService.comment
      .create({
        data: {
          ...createCommmetDto,
          authorIdx: userIdx,
        },
        select: {
          idx: true,
        },
      })
      .then((comment) => ({ idx: comment.idx }));
  }

  /**
   * 댓글 수정 프로세스
   * 1. 댓글이 존재하는지 확인
   * 2. 댓글 작성자와 수정하려는 유저가 같은지 확인
   * 3. 댓글 수정
   * 4. 댓글 수정 시 게시글 작성자에게 알림 전송
   */
  async updateComment(
    updatecommentDto: UpdateCommentDto,
    userIdx: IUser['idx'],
  ): Promise<void> {
    const checkExistComment = await this.prismaService.comment.findUnique({
      where: {
        idx: updatecommentDto.idx,
        deletedAt: null,
      },
    });

    if (!checkExistComment) {
      this.logger.debug('해당하는 댓글이 존재하지 않습니다.');
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }

    if (checkExistComment.authorIdx !== userIdx) {
      this.logger.debug('댓글 작성자만 수정할 수 있습니다.');
      throw new NotFoundException('해당하는 댓글이 존재하지 않습니다.');
    }

    await this.prismaService.comment.update({
      where: {
        idx: updatecommentDto.idx,
        deletedAt: null,
      },
      data: {
        ...updatecommentDto,
      },
    });
  }
}
