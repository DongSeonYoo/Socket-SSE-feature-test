import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReplyRequestDto } from './dto/create-reply.dto';
import { IReply } from './entities/reply.entity';
import { IUser } from '../users/entities/user.entity';
import { IComment } from '../comments/entities/comment.entity';

@Injectable()
export class RepliesService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReply(
    createReplyInput: CreateReplyRequestDto,
    userIdx: IUser['idx'],
  ): Promise<Pick<IReply, 'idx'>> {
    return this.prismaService.reply.create({
      data: {
        authorIdx: userIdx,
        content: createReplyInput.content,
        commentIdx: createReplyInput.commentIdx,
      },
      select: {
        idx: true,
      },
    });
  }
}
