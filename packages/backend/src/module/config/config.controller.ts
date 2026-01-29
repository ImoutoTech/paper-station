import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  VERSION_NEUTRAL,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  HttpCode,
  Headers,
  Res,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto, UpdateConfigDto } from '@/dto';
import { AuthRoles, UserParams } from '@reus-able/nestjs';
import { UserJwtPayload } from '@reus-able/types';
import { FastifyReply } from 'fastify';

@Controller({
  path: 'config',
  version: [VERSION_NEUTRAL, '1'],
})
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @HttpCode(200)
  @AuthRoles('user')
  create(
    @Body() createConfigDto: CreateConfigDto,
    @UserParams() user: UserJwtPayload,
  ) {
    return this.configService.create(createConfigDto, user.id);
  }

  @Get()
  @AuthRoles('user')
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search = '',
    @UserParams() user: UserJwtPayload,
  ) {
    return this.configService.findAll(user.id, offset, limit, search);
  }

  @Get('get')
  async getConfig(
    @Query('slug') slug: string,
    @Headers('origin') origin: string,
    @Res() reply: FastifyReply,
  ) {
    const result = await this.configService.getConfig(slug, origin);
    return reply.send(result);
  }

  @Get(':slug')
  @AuthRoles('user')
  findOne(@Param('slug') slug: string, @UserParams() user: UserJwtPayload) {
    return this.configService.findOne(slug, user.id);
  }

  @Put(':slug')
  @AuthRoles('user')
  update(
    @Param('slug') slug: string,
    @Body() updateConfigDto: UpdateConfigDto,
    @UserParams() user: UserJwtPayload,
  ) {
    return this.configService.update(slug, updateConfigDto, user.id);
  }

  @Delete(':slug')
  @AuthRoles('user')
  remove(@Param('slug') slug: string, @UserParams() user: UserJwtPayload) {
    return this.configService.remove(slug, user.id);
  }

  @Post('refresh')
  @AuthRoles('admin')
  refresh() {
    return this.configService.refreshCache();
  }
}
