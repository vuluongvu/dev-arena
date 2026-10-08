import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOneUser(username);
  }

  @Put(':username')
  update(@Param('username') username: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(username, dto);
  }
}
