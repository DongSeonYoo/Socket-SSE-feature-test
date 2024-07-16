import { HttpStatus, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiException } from './api-exception.decorator';
import { JwtAccessGuard } from 'src/apis/auth/guards/jwt-access.guard';

export const LoginAuth = () => {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    UseGuards(JwtAccessGuard),
    ApiException(HttpStatus.UNAUTHORIZED, '로그인 필요한 서비스입니다'),
  );
};
