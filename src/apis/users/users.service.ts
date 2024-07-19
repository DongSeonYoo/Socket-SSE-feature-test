import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './entities/user.entity';
import { LoginRequestDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { IAuth } from '../auth/interfaces/auth.interface';

@Injectable()
export class UsersService {
  private readonly logger: LoggerService = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async login(dto: LoginRequestDto): Promise<IAuth.IJwtPayload> {
    const checkUser = await this.prismaService.user.findFirst({
      select: {
        idx: true,
        email: true,
        name: true,
        password: true,
      },
      where: {
        email: dto.email,
        deletedAt: null,
      },
    });

    if (!checkUser) {
      this.logger.debug('아이디가 일치하지 않습니다.');
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다');
    }

    const comparePassword = await bcrypt.compare(
      dto.password,
      checkUser.password,
    );
    if (!comparePassword) {
      this.logger.debug('비밀번호가 일치하지 않습니다.');
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지 않습니다');
    }

    return {
      idx: checkUser.idx,
      name: checkUser.name,
    };
  }

  async createUser(dto: CreateUserDto): Promise<IUser['idx']> {
    await Promise.all([this.checkDuplicateEmail(dto.email)]);

    return this.prismaService.user
      .create({
        data: {
          ...dto,
          password: bcrypt.hashSync(dto.password, 10),
        },
        select: {
          idx: true,
        },
      })
      .then((result) => result.idx);
  }

  async checkDuplicateEmail(email: IUser['email']): Promise<void> {
    const checkEmail = await this.prismaService.user.findFirst({
      select: {
        email: true,
      },
      where: {
        email,
        deletedAt: null,
      },
    });

    if (checkEmail?.email) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    return;
  }

  async getUserInfo(idx: IUser['idx']): Promise<IUser.IUserProfileResponse> {
    return this.prismaService.user
      .findUnique({
        where: {
          idx,
          deletedAt: null,
        },
      })
      .then((result) => {
        return {
          idx: result.idx,
          email: result.email,
          name: result.name,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        };
      });
  }
}
