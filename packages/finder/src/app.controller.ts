import { Controller, Get, Headers, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getConfig(@Query('slug') slug: string, @Headers('origin') origin: string) {
    return this.appService.getConfig(slug, origin);
  }
}
