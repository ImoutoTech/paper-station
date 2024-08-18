import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto, UpdateConfigDto } from '@/dto';
import { ConfigEntity, UserEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BusinessException, HLogger, HLOGGER_TOKEN } from '@reus-able/nestjs';
import { isNil } from 'lodash';

@Injectable()
export class ConfigService {
  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

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

    return null;
  }
}
