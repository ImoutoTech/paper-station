import { Inject, Injectable } from '@nestjs/common';
import { CreateSiteDto, UpdateSiteDto } from '@/dto';
import { ConfigEntity, SiteEntity, UserEntity } from '@/entities';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BusinessException, HLogger, HLOGGER_TOKEN } from '@reus-able/nestjs';
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
    return `This action returns a #${id} site`;
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

    return null;
  }

  async remove(id: number, ssoId: number) {
    return `This action removes a #${id} site`;
  }
}
