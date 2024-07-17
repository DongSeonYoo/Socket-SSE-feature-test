import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuth } from './interfaces/auth.interface';
import { IUser } from '../users/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateAccessToken(
    payload: IAuth.IJwtPayload,
  ): Promise<IUser.ILoginResponse> {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async checkExistUser(idx: IUser['idx']): Promise<IAuth.IJwtPayload> {
    // 유저 존재 여부 확인 로직
    const user = await this.prismaService.user.findUnique({
      select: {
        idx: true,
        name: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    return {
      idx: user.idx,
      name: user.name,
    };
  }
}
