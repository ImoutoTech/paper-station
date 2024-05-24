import { Controller, Get, Body, VERSION_NEUTRAL } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/user/create-user.dto';

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  login(@Body() body: CreateUserDto) {
    return this.userService.login(body);
  }

  @Get('data')
  findOne() {
    return this.userService.findOne(0);
  }
}
