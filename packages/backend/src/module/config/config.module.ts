import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { ConfigEntity, UserEntity } from '@/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity, UserEntity])],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class ConfigModule {}
