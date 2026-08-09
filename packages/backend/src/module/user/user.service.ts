import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HLogger, HLOGGER_TOKEN, BusinessException } from '@reus-able/nestjs';
import { UserRole, type UserJwtPayload } from '@reus-able/types';
import { randomBytes } from 'crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import type * as OpenIdClient from 'openid-client';
import { Repository } from 'typeorm';
import { UserEntity } from '@/entities';
import {
  AUTH_COOKIE,
  AUTH_MAX_AGE_SECONDS,
  CSRF_COOKIE,
  H_OIDC_ISSUER,
  OIDC_TRANSACTION_COOKIE,
  OIDC_TRANSACTION_MAX_AGE_SECONDS,
} from './user.constants';

import {
  OidcTransactionCodec,
  parseOidcSubject,
  safeReturnTo,
  type OidcTransaction,
} from './oidc-security';

interface OidcClaims {
  sub?: string;
  name?: string;
  preferred_username?: string;
  nickname?: string;
  email?: string;
  picture?: string;
}

const importOpenIdClient = new Function(
  'return import("openid-client")',
) as () => Promise<typeof OpenIdClient>;

@Injectable()
export class UserService {
  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  private oidcConfig?: OpenIdClient.Configuration;

  private transactionCodec?: OidcTransactionCodec;

  constructor(private readonly config: ConfigService) {}

  async startLogin(
    returnTo: string,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const redirectPath = safeReturnTo(returnTo);
    if (this.readSession(request)) return this.frontendUrl(redirectPath);

    const oidc = await importOpenIdClient();
    const oidcConfig = await this.getOidcConfig(oidc);
    const verifier = oidc.randomPKCECodeVerifier();
    const transaction: OidcTransaction = {
      verifier,
      state: oidc.randomState(),
      nonce: oidc.randomNonce(),
      returnTo: redirectPath,
      issuedAt: Date.now(),
    };

    reply.setCookie(
      OIDC_TRANSACTION_COOKIE,
      this.getTransactionCodec().encode(transaction),
      this.cookieOptions(OIDC_TRANSACTION_MAX_AGE_SECONDS, '/user/oidc'),
    );

    return oidc.buildAuthorizationUrl(oidcConfig, {
      redirect_uri: this.config.getOrThrow<string>('OIDC_REDIRECT_URI'),
      scope: 'openid profile email',
      state: transaction.state,
      nonce: transaction.nonce,
      code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
      code_challenge_method: 'S256',
    }).href;
  }

  async completeLogin(request: FastifyRequest, reply: FastifyReply) {
    const encrypted = request.cookies?.[OIDC_TRANSACTION_COOKIE];
    reply.clearCookie(OIDC_TRANSACTION_COOKIE, { path: '/user/oidc' });
    if (!encrypted) return this.callbackErrorUrl('oidc_invalid_callback');

    let transaction: OidcTransaction;
    try {
      transaction = this.getTransactionCodec().decode(encrypted);
    } catch {
      this.logger.warn('OIDC transaction cookie 校验失败', UserService.name);
      return this.callbackErrorUrl('oidc_invalid_callback');
    }

    const requestUrl = new URL(request.url, 'http://localhost');
    if (requestUrl.searchParams.get('error') === 'access_denied') {
      return this.callbackErrorUrl('oidc_cancelled');
    }

    try {
      const oidc = await importOpenIdClient();
      const oidcConfig = await this.getOidcConfig(oidc);
      const callbackUrl = new URL(
        this.config.getOrThrow<string>('OIDC_REDIRECT_URI'),
      );
      callbackUrl.search = requestUrl.search;

      const tokens = await oidc.authorizationCodeGrant(
        oidcConfig,
        callbackUrl,
        {
          pkceCodeVerifier: transaction.verifier,
          expectedState: transaction.state,
          expectedNonce: transaction.nonce,
        },
      );
      const user = await this.upsertUser(tokens.claims() as OidcClaims);
      this.setSession(reply, user);
      this.logger.log(`用户#${user.ssoId}通过 OIDC 登录成功`, UserService.name);
      return this.frontendUrl('/login', { returnTo: transaction.returnTo });
    } catch (error) {
      this.logger.warn(
        `OIDC callback 校验失败: ${this.errorName(error)}`,
        UserService.name,
      );
      return this.callbackErrorUrl('oidc_invalid_callback');
    }
  }

  logout(reply: FastifyReply) {
    reply.clearCookie(AUTH_COOKIE, { path: '/' });
    reply.clearCookie(CSRF_COOKIE, { path: '/' });
  }

  logOidcFailure(stage: string, error: unknown) {
    this.logger.warn(
      `OIDC ${stage} 失败: ${this.errorName(error)}`,
      UserService.name,
    );
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { ssoId: id } });
    if (isNil(user)) throw new BusinessException('id错误');
    return user.getData();
  }

  private async getOidcConfig(oidc: typeof OpenIdClient) {
    if (!this.oidcConfig) {
      const issuer = this.config.getOrThrow<string>('OIDC_ISSUER');
      if (issuer !== H_OIDC_ISSUER) throw new Error('invalid_oidc_issuer');
      this.oidcConfig = await oidc.discovery(
        new URL(issuer),
        this.config.getOrThrow<string>('OIDC_CLIENT_ID'),
        undefined,
        oidc.None(),
      );
    }
    return this.oidcConfig;
  }

  private async upsertUser(claims: OidcClaims) {
    const ssoId = parseOidcSubject(claims.sub);
    const name =
      claims.name ||
      claims.preferred_username ||
      claims.nickname ||
      claims.email ||
      claims.sub;
    const email = claims.email || '';
    const avatar = claims.picture || null;
    let user = await this.userRepo.findOne({ where: { ssoId } });

    if (!user) {
      user = this.userRepo.create({ ssoId, name, email, avatar });
    } else {
      user.name = name;
      user.email = email;
      user.avatar = avatar;
    }

    return this.userRepo.save(user);
  }

  private setSession(reply: FastifyReply, user: UserEntity) {
    const payload: UserJwtPayload = {
      email: user.email,
      id: user.ssoId,
      role: UserRole.USER,
      refresh: false,
    };
    const token = jwt.sign(
      payload,
      this.config.getOrThrow<string>('TOKEN_SECRET'),
      { expiresIn: AUTH_MAX_AGE_SECONDS },
    );
    reply.setCookie(
      AUTH_COOKIE,
      token,
      this.cookieOptions(AUTH_MAX_AGE_SECONDS, '/'),
    );
    reply.setCookie(
      CSRF_COOKIE,
      randomBytes(32).toString('base64url'),
      this.cookieOptions(AUTH_MAX_AGE_SECONDS, '/'),
    );
  }

  private readSession(request: FastifyRequest) {
    const token = request.cookies?.[AUTH_COOKIE];
    if (!token) return null;
    try {
      return jwt.verify(
        token,
        this.config.getOrThrow<string>('TOKEN_SECRET'),
      ) as UserJwtPayload;
    } catch {
      return null;
    }
  }

  private cookieOptions(maxAge: number, path: string) {
    return {
      httpOnly: true,
      secure: this.config.get('COOKIE_SECURE', 'true') !== 'false',
      sameSite: 'lax' as const,
      path,
      maxAge,
    };
  }

  private getTransactionCodec() {
    if (!this.transactionCodec) {
      this.transactionCodec = new OidcTransactionCodec(
        this.config.getOrThrow<string>('SESSION_SECRET'),
      );
    }
    return this.transactionCodec;
  }

  private frontendUrl(path: string, params?: Record<string, string>) {
    const url = new URL(path, this.config.getOrThrow<string>('FRONT_URL'));
    Object.entries(params || {}).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    return url.href;
  }

  callbackErrorUrl(code: string) {
    return this.frontendUrl('/login', { error: code });
  }

  private errorName(error: unknown) {
    return error instanceof Error ? error.name : 'UnknownError';
  }
}
