import {
  Controller,
  Get,
  Post,
  VERSION_NEUTRAL,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthRoles, UserParams } from '@reus-able/nestjs';
import type { UserJwtPayload } from '@reus-able/types';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('oidc/login')
  async login(
    @Query('returnTo') returnTo: string,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    try {
      const redirect = await this.userService.startLogin(
        returnTo,
        request,
        reply,
      );
      return reply.redirect(redirect, 302);
    } catch (error) {
      this.userService.logOidcFailure('login', error);
      return reply.redirect(
        this.userService.callbackErrorUrl('oidc_unavailable'),
        302,
      );
    }
  }

  @Get('oidc/callback')
  async callback(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const redirect = await this.userService.completeLogin(request, reply);
    return reply.redirect(redirect, 302);
  }

  @Get('data')
  @AuthRoles('user')
  findOne(
    @UserParams() user: UserJwtPayload,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const csrfToken = request.cookies?.ps_csrf;
    if (csrfToken) reply.header('X-CSRF-Token', csrfToken);
    return this.userService.findOne(user.id);
  }

  @Post('logout')
  @AuthRoles('user')
  logout(@Res() reply: FastifyReply) {
    this.userService.logout(reply);
    return reply.send({ success: true });
  }
}
