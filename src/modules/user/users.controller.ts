import {
  Body,
  Catch,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/decorators/catchError';
import JwtAuthGuard from '../auth/guard/jwtAuth.guard';
import UpdateUserDto from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Query() queries) {
    const { email } = queries;
    const users = this.usersService.getByEmail(email);
    return users;
  }

  @Patch('/:userId')
  @UseFilters(AllExceptionsFilter)
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Req() request,
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = params;
    const updatedUser = await this.usersService.updateUserById(
      Number(userId),
      updateUserDto,
    );
    return updatedUser;
  }
}
