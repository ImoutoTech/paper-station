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

  async create(body: CreateSiteDto, ssoId: number) {
    return 'This action adds a new site';
  }

  async findAll(ssoId: number, offset: number, limit: number, search = '') {
    return `This action returns all site`;
  }

  async findOne(id: number, ssoId: number) {
    return `This action returns a #${id} site`;
  }

  async update(id: number, body: UpdateSiteDto, ssoId: number) {
    return `This action updates a #${id} site`;
  }

  async remove(id: number, ssoId: number) {
    return `This action removes a #${id} site`;
  }
}
