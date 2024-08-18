import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  VERSION_NEUTRAL,
  HttpCode,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto, UpdateSiteDto } from '@/dto';
import { AuthRoles, UserParams } from '@reus-able/nestjs';
import { UserJwtPayload } from '@reus-able/types';

@Controller({
  path: 'site',
  version: [VERSION_NEUTRAL, '1'],
})
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @HttpCode(200)
  @AuthRoles('user')
  create(
    @Body() createSiteDto: CreateSiteDto,
    @UserParams() user: UserJwtPayload,
  ) {
    return this.siteService.create(createSiteDto, user.id);
  }

  @Get()
  @AuthRoles('user')
  findAll(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset = 0,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search = '',
    @UserParams() user: UserJwtPayload,
  ) {
    return this.siteService.findAll(user.id, offset, limit, search);
  }

  @Get(':id')
  @AuthRoles('user')
  findOne(@Param('id') id: string, @UserParams() user: UserJwtPayload) {
    return this.siteService.findOne(+id, user.id);
  }

  @Patch(':id')
  @AuthRoles('user')
  update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @UserParams() user: UserJwtPayload,
  ) {
    return this.siteService.update(+id, updateSiteDto, user.id);
  }

  @Delete(':id')
  @AuthRoles('user')
  remove(@Param('id') id: string, @UserParams() user: UserJwtPayload) {
    return this.siteService.remove(+id, user.id);
  }
}
