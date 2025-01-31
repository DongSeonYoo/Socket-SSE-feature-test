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
import { PagenationRequestDto } from 'src/dtos/pagenate.dto';
import { PostCountResponseDto } from './dto/post-count.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostUpdatedEvent } from '../notifications/events/post.event';
import { NotificationName } from '@prisma/client';

@Injectable()
export class PostsService {
  private readonly logger: LoggerService = new Logger(UsersService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getPostsCount(): Promise<PostCountResponseDto> {
    return this.prismaService.post
      .count({
        where: {
          deletedAt: null,
        },
      })
      .then((res) => {
        return {
          count: res,
        };
      });
  }

  async getPosts(
    pageNate: PagenationRequestDto,
  ): Promise<IPost.IPostListOutput[]> {
    const postsResult = await this.prismaService.post.findMany({
      include: {
        User: true,
      },
      where: {
        deletedAt: null,
      },
      skip: pageNate.getOffset(),
      take: pageNate.limit,
    });

    return postsResult.map((post) => ({
      idx: post.idx,
      title: post.title,
      authorIdx: post.authorIdx,
      authorName: post.User.name,
      createdAt: post.createdAt,
    }));
  }

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

    const updatePostResult = await this.prismaService.post.update({
      where: {
        idx: updatePostDto.idx,
        authorIdx: user.idx,
      },
      data: {
        ...updatePostDto,
      },
      select: {
        Comment: {
          distinct: 'authorIdx',
        },
      },
    });

    updatePostResult.Comment.map((comment) => {
      this.eventEmitter.emitAsync(
        PostUpdatedEvent.eventName,
        new PostUpdatedEvent(
          user.idx,
          new Date(),
          updatePostDto.idx,
          NotificationName.POST,
          comment.authorIdx,
          updatePostDto.content,
        ),
      );
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
