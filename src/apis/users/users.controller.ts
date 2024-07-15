import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 회원가입
   */
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiSuccess(CreateUserResponseDto)
  createUser(@Body() createUser: CreateUserDto) {
    return 'return in createUserController';
  }

  /**
   * 로그인
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login() {}

  /**
   * 회원 정보 조회
   */
  @Get('info')
  getUserInfo() {}
}
