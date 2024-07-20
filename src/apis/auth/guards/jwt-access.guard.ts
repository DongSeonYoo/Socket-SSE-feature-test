import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      // 테스트 용도로 임시로 주석 처리
      // throw new UnauthorizedException('회원만 이용 가능한 서비스입니다');

      // 테스트용: 만약 user가 없다면 임시로 2번유저로 간주
      user = { idx: 2 };
    }

    return user;
  }
}
