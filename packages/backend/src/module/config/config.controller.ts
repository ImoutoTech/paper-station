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
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from '../../dto/config/create-config.dto';
import { UpdateConfigDto } from '../../dto/config/update-config.dto';
import { AuthRoles, UserParams } from '@reus-able/nestjs';
import { UserJwtPayload } from '@reus-able/types';

@Controller({
  path: 'config',
  version: [VERSION_NEUTRAL, '1'],
})
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @AuthRoles('user')
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
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
  remove(@Param('slug') slug: string) {
    return this.configService.remove(slug);
  }
}
