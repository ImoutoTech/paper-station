import { Controller, Get, VERSION_NEUTRAL, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  login(@Query('ticket') ticket: string) {
    return this.userService.login(ticket);
  }

  @Get('data')
  findOne() {
    return this.userService.findOne(0);
  }
}
