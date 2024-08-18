import { Injectable } from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from '@/dto';
import { ConfigEntity, SiteEntity, UserEntity } from '@/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SiteService {
  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @InjectRepository(SiteEntity)
  private siteRepo: Repository<SiteEntity>;

  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site';
  }

  findAll() {
    return `This action returns all site`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
