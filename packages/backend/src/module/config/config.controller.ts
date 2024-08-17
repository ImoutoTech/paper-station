import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from '../../dto/config/create-config.dto';
import { UpdateConfigDto } from '../../dto/config/update-config.dto';
import { AuthRoles } from '@reus-able/nestjs';

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
  findAll() {
    return this.configService.findAll();
  }

  @Get(':slug')
  @AuthRoles('user')
  findOne(@Param('slug') slug: string) {
    return this.configService.findOne(slug);
  }

  @Patch(':id')
  @AuthRoles('user')
  update(
    @Param('slug') slug: string,
    @Body() updateConfigDto: UpdateConfigDto,
  ) {
    return this.configService.update(slug, updateConfigDto);
  }

  @Delete(':id')
  @AuthRoles('user')
  remove(@Param('slug') slug: string) {
    return this.configService.remove(slug);
  }
}
