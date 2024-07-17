import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { IPost } from './entities/post.entity';
import { IUser } from '../users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  private readonly logger: LoggerService = new Logger(UsersService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(
    createPostDto: CreatePostDto,
    authorIdx: number,
  ): Promise<IPost['idx']> {
    return this.prismaService.post
      .create({
        data: {
          authorIdx,
          title: createPostDto.title,
          content: createPostDto.content,
        },
        select: {
          idx: true,
        },
      })
      .then((post) => post.idx);
  }

  async getPost(postIdx: IPost['idx']): Promise<IPost.IDetialPostOutput> {
    return this.prismaService.post
      .findUnique({
        where: {
          idx: postIdx,
        },
      })
      .then((post) => {
        if (!post) {
          throw new BadRequestException('게시글을 찾을 수 없습니다');
        }
        return post;
      });
  }

  async updatePost(
    user: IAuth.IJwtPayload,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    await Promise.all([
      this.checkExistPost(updatePostDto.idx),
      this.checkOwnPost(updatePostDto.idx, user.idx),
    ]);

    await this.prismaService.post.update({
      where: {
        idx: updatePostDto.idx,
        authorIdx: user.idx,
      },
      data: {
        ...updatePostDto,
      },
    });
  }

  async checkExistPost(postIdx: IPost['idx']): Promise<void> {
    const post = await this.prismaService.post.findUnique({
      where: {
        idx: postIdx,
        deletedAt: null,
      },
    });

    if (!post) {
      this.logger.debug('게시글이 존재하지 않는 경우');
      throw new BadRequestException('게시글을 찾을 수 없습니다');
    }
  }

  async checkOwnPost(
    postIdx: IPost['idx'],
    userIdx: IUser['idx'],
  ): Promise<void> {
    const post = await this.prismaService.post.findUnique({
      where: {
        idx: postIdx,
        authorIdx: userIdx,
        deletedAt: null,
      },
    });

    if (post?.authorIdx !== userIdx) {
      this.logger.debug('게시글 작성자가 아닌 경우');
      throw new BadRequestException('게시글 작성자가 아닙니다');
    }
  }
}
