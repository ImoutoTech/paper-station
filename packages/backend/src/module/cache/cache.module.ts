import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigEntity } from '@/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CacheService],
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
})
export class CacheModule {}
