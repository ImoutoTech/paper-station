import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto, UpdateConfigDto } from '@/dto';
import { ConfigEntity, UserEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  BusinessException,
  HLogger,
  HLOGGER_TOKEN,
  RedisService,
} from '@reus-able/nestjs';
import { isNil } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BUSINESS_ERROR_CODE, BUSINESS_ERROR_TEXT } from '@reus-able/const';

@Injectable()
export class ConfigService {
  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  @Inject(EventEmitter2)
  private emitter: EventEmitter2;

  @Inject(RedisService)
  private cache: RedisService;

  private log(text: string) {
    this.logger.log(text, ConfigService.name);
  }

  private warn(text: string) {
    this.logger.warn(text, ConfigService.name);
  }

  async create(body: CreateConfigDto, ssoId: number) {
    const owner = await this.userRepo.findOneBy({ ssoId });

    const newCfg = this.cfgRepo.create({
      name: body.name,
      data: JSON.parse(body.data),
      slug: body.slug,
      owner,
    });

    await this.cfgRepo.save(newCfg);
    this.log(`用户#${ssoId}创建配置slug=${body.slug}`);

    return newCfg.getData();
  }

  async findAll(ssoId: number, offset: number, limit: number, search = '') {
    const page = offset / limit || 1;
    const { items, meta } = await paginate<ConfigEntity>(
      this.cfgRepo,
      { page, limit },
      {
        where: { name: Like(`%${search}%`), owner: { ssoId } },
        relations: { owner: true },
        order: {
          created_at: 'ASC',
        },
      },
    );

    this.log(
      `获取用户#${ssoId}配置列表(page=${page}, size=${limit}, search=${search})，共查询到${meta.totalItems}条结果`,
    );

    return {
      items: items.map((cfg) => cfg.getData()),
      count: meta.totalItems,
      total: meta.totalItems,
    };
  }

  async findOne(slug: string, ssoId: number) {
    const cfg = await this.cfgRepo.findOne({
      relations: { owner: true },
      where: {
        slug,
        owner: {
          ssoId,
        },
      },
    });

    if (isNil(cfg)) {
      this.log(`用户#${ssoId}获取配置${slug}详情失败，无该配置`);
      throw new BusinessException('无效slug');
    }

    this.log(`用户#${ssoId}获取配置${slug}详情`);

    return cfg.getData();
  }

  async update(slug: string, body: UpdateConfigDto, ssoId: number) {
    const cfg = await this.cfgRepo.findOne({
      relations: { owner: true },
      where: {
        slug,
        owner: {
          ssoId,
        },
      },
    });

    if (isNil(cfg)) {
      this.warn(`用户#${ssoId}编辑配置${slug}失败，无该配置`);
      throw new BusinessException('无效slug');
    }

    cfg.data = JSON.parse(body.data);
    cfg.name = body.name;
    await this.cfgRepo.save(cfg);
    this.log(`用户#${ssoId}编辑配置${slug}成功`);
    this.emitter.emit('updateConfigs', {
      slugs: [slug],
    });

    return cfg.getData();
  }

  async remove(slug: string, ssoId: number) {
    const cfg = await this.cfgRepo.findOne({
      relations: { owner: true },
      where: {
        slug,
        owner: {
          ssoId,
        },
      },
    });

    if (isNil(cfg)) {
      this.warn(`用户#${ssoId}删除配置${slug}失败，无该配置`);
      throw new BusinessException('无效slug');
    }

    await this.cfgRepo.remove(cfg);
    this.log(`用户#${ssoId}删除配置${slug}`);
    this.emitter.emit('deleteConfigs', {
      slugs: [slug],
    });

    return null;
  }

  async refreshCache() {
    const configs = await this.cfgRepo.find();
    const slugs = configs.map((c) => c.slug);
    this.emitter.emit('updateConfigs', {
      slugs,
    });
    return null;
  }

  async getConfig(slug: string, origin: string) {
    const data = await this.cache.jsonGet<{
      data: object;
      domains: string[];
    }>(`config-${slug}`);

    if (isNil(data)) {
      this.warn(`站点${origin}请求不存在的配置${slug}`);
      return {
        data: null,
        code: BUSINESS_ERROR_CODE.COMMON,
        msg: 'no such config',
      };
    }

    if (!data.domains.includes(origin)) {
      this.warn(`站点${origin}请求无权限的配置${slug}`);
      return {
        data: null,
        code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
        msg: BUSINESS_ERROR_TEXT[BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN],
      };
    }

    this.log(`站点${origin}请求配置${slug}成功`);
    return data.data;
  }
}
