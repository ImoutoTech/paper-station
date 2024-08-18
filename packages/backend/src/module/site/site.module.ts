import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity, SiteEntity, UserEntity } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity, UserEntity, SiteEntity])],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
