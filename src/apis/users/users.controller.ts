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
import { ApiException } from 'src/decorators/api-exception.decorator';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';
import { LoginAuth } from 'src/decorators/jwt-auth.decorator';
import { LoginUser } from 'src/decorators/login-user.decorator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserProfileResponseDto } from './dto/user-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 회원가입
   */
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiSuccess(CreateUserResponseDto)
  @ApiException(HttpStatus.CONFLICT, '이미 존재하는 이메일입니다.')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * 로그인
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiSuccess(LoginResponseDto)
  async login(@Body() loginDto: LoginRequestDto) {
    const userPayload = await this.usersService.login(loginDto);

    return this.authService.generateAccessToken(userPayload);
  }

  /**
   * 회원 정보 조회
   */
  @Get('info')
  @LoginAuth()
  @ApiSuccess(UserProfileResponseDto)
  getUserInfo(@LoginUser() user: IAuth.IJwtPayload) {
    return this.usersService.getUserInfo(user.idx);
  }
}
