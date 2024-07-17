import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAccessStrategy } from '../auth/strategy/jwt-access.strategy';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, JwtAccessStrategy],
})
export class UsersModule {}
