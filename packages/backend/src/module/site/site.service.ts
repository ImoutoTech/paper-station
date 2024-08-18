import { Inject, Injectable } from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from '@/dto';
import { ConfigEntity, SiteEntity, UserEntity } from '@/entities';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  BusinessException,
  HLogger,
  HLOGGER_TOKEN,
  RedisService,
} from '@reus-able/nestjs';
import { isNil } from 'lodash';

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

  @Inject(RedisService)
  private cache: RedisService;

  async updateCache(slugs: string[]) {
    const configs = await this.cfgRepo.find({
      relations: { sites: true },
      where: { slug: In(slugs) },
    });

    for (const config of configs) {
      const domains = config.sites.map((s) => s.domains).flat();
      if (domains.length) {
        await this.cache.jsonSet(`config-${config.slug}`, {
          domains,
          data: config.data,
        });
      } else {
        await this.cache.del(`config-${config.slug}`);
      }
    }
  }

  async create(body: CreateSiteDto, ssoId: number) {
    const owner = await this.userRepo.findOneBy({ ssoId });
    const configs = await this.cfgRepo.findBy({
      slug: In(body.configs.split(',')),
    });

    const newSite = this.siteRepo.create({
      name: body.name,
      domains: body.domains.split(','),
      configs,
      owner,
    });

    await this.siteRepo.save(newSite);
    this.log(`用户#${ssoId}创建了新的站点${newSite.name}`);
    await this.updateCache(newSite.configs.map((c) => c.slug));

    return null;
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
      items: items.map((site) => site.getData()),
      count: meta.totalItems,
      total: meta.totalItems,
    };
  }

  async findOne(id: number, ssoId: number) {
    const site = await this.siteRepo.findOne({
      where: {
        id,
        owner: {
          ssoId,
        },
      },
      relations: { owner: true, configs: true },
    });

    if (isNil(site)) {
      this.warn(`用户#${ssoId}获取站点${id}失败，无该站点`);
      throw new BusinessException('无效站点id');
    }

    this.log(`用户#${ssoId}获取站点${id}信息`);

    return site.getData();
  }

  async update(id: number, body: UpdateSiteDto, ssoId: number) {
    const site = await this.siteRepo.findOne({
      where: {
        id,
        owner: {
          ssoId,
        },
      },
      relations: { owner: true },
    });

    if (isNil(site)) {
      this.warn(`用户#${ssoId}编辑站点${id}失败，无该站点`);
      throw new BusinessException('无效站点id');
    }

    const configs = await this.cfgRepo.find({
      where: {
        slug: In(body.configs.split(',')),
      },
    });

    site.configs = configs;
    site.name = body.name;
    site.domains = body.domains.split(',');

    await this.siteRepo.save(site);
    this.warn(`用户#${ssoId}编辑站点${id}成功`);
    await this.updateCache(site.configs.map((c) => c.slug));

    return null;
  }

  async remove(id: number, ssoId: number) {
    const site = await this.siteRepo.findOne({
      where: {
        id,
        owner: {
          ssoId,
        },
      },
      relations: { owner: true, configs: true },
    });

    if (isNil(site)) {
      this.warn(`用户#${ssoId}删除站点${id}失败，无该站点`);
      throw new BusinessException('无效站点id');
    }

    const configs = site.configs.map((c) => c.slug);
    await this.siteRepo.remove(site);
    this.log(`用户#${ssoId}删除站点${id}`);
    await this.updateCache(configs);

    return null;
  }
}
