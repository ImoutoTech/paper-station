import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto, UpdateConfigDto } from '@/dto';
import { ConfigEntity, UserEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { HLogger, HLOGGER_TOKEN } from '@reus-able/nestjs';

@Injectable()
export class ConfigService {
  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  @InjectRepository(UserEntity)
  private userRepo: Repository<UserEntity>;

  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  create(createConfigDto: CreateConfigDto) {
    return createConfigDto;
  }

  private log(text: string) {
    this.logger.log(text, ConfigService.name);
  }

  private warn(text: string) {
    this.logger.warn(text, ConfigService.name);
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

  findOne(id: string) {
    return `This action returns a #${id} config`;
  }

  update(id: string, updateConfigDto: UpdateConfigDto) {
    return {
      id,
      data: updateConfigDto,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} config`;
  }
}
