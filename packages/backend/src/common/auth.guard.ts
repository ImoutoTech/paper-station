import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { UserJwtPayload } from '@reus-able/types';
import type { FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { AUTH_COOKIE, CSRF_COOKIE } from '@/module/user/user.constants';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.cookies?.[AUTH_COOKIE];
    if (!token) throw new UnauthorizedException('登录态不存在');

    let user: UserJwtPayload;
    try {
      user = jwt.verify(
        token,
        this.config.getOrThrow<string>('TOKEN_SECRET'),
      ) as UserJwtPayload;
    } catch {
      throw new UnauthorizedException('登录态无效或已过期');
    }

    if (user.refresh || (user.role !== 0 && roles.includes('admin'))) {
      throw new ForbiddenException('无权访问');
    }

    if (!SAFE_METHODS.has(request.method)) this.verifyCsrf(request);

    (request as FastifyRequest & { user: UserJwtPayload }).user = user;
    return true;
  }

  private verifyCsrf(request: FastifyRequest) {
    const expectedOrigin = new URL(this.config.getOrThrow<string>('FRONT_URL'))
      .origin;
    const source = request.headers.origin || request.headers.referer;
    let sourceOrigin = '';
    try {
      sourceOrigin = source ? new URL(source).origin : '';
    } catch {
      sourceOrigin = '';
    }
    if (sourceOrigin !== expectedOrigin) {
      throw new ForbiddenException('请求来源无效');
    }

    const cookieToken = request.cookies?.[CSRF_COOKIE];
    const headerToken = request.headers['x-csrf-token'];
    if (!cookieToken || headerToken !== cookieToken) {
      throw new ForbiddenException('CSRF 校验失败');
    }
  }
}
