import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   */
  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiSuccess(CreateUserResponseDto)
  createUser(@Body() createUser: CreateUserDto) {
    return 'return in createUserController';
  }
}
