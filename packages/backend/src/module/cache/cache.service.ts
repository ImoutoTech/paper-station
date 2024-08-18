import { ConfigEntity } from '@/entities';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@reus-able/nestjs';
import { In, Repository } from 'typeorm';

@Injectable()
export class CacheService {
  @Inject(RedisService)
  private cache: RedisService;

  @InjectRepository(ConfigEntity)
  private cfgRepo: Repository<ConfigEntity>;

  @OnEvent('updateConfigs')
  async updateCache(data: { slugs: string[] }) {
    const { slugs = [] } = data;
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

  @OnEvent('deleteConfigs')
  async deleteCache(data: { slugs: string[] }) {
    const { slugs = [] } = data;

    for (const slug of slugs) {
      await this.cache.del(`config-${slug}`);
    }
  }
}
