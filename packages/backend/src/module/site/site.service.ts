import { Inject, Injectable } from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from '@/dto';
import { ConfigEntity, SiteEntity, UserEntity } from '@/entities';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { HLogger, HLOGGER_TOKEN } from '@reus-able/nestjs';

@Injectable()
export class SiteService {
  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @InjectRepository(SiteEntity)
  private siteRepo: Repository<SiteEntity>;

  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  private log(text: string) {
    this.logger.log(text, SiteService.name);
  }

  private warn(text: string) {
    this.logger.warn(text, SiteService.name);
  }

  async create(body: CreateSiteDto, ssoId: number) {
    return 'This action adds a new site';
  }

  async findAll(ssoId: number, offset: number, limit: number, search = '') {
    const page = offset / limit || 1;
    const { items, meta } = await paginate<SiteEntity>(
      this.siteRepo,
      { page, limit },
      {
        where: { name: Like(`%${search}%`), owner: { ssoId } },
        relations: { owner: true, configs: true },
        order: {
          created_at: 'ASC',
        },
      },
    );

    this.log(
      `获取用户#${ssoId}站点列表(page=${page}, size=${limit}, search=${search})，共查询到${meta.totalItems}条结果`,
    );

    return {
      items: items.map((site) => ({
        ...site.getData(),
        owner: site.owner.ssoId,
        configs: site.configs.map((cfg) => cfg.slug),
      })),
      count: meta.totalItems,
      total: meta.totalItems,
    };
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
