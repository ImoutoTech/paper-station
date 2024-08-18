import { Inject, Injectable } from '@nestjs/common';
import { HLogger, HLOGGER_TOKEN, RedisService } from '@reus-able/nestjs';
import { BUSINESS_ERROR_CODE, BUSINESS_ERROR_TEXT } from '@reus-able/const';
import { isNil } from 'lodash';

interface IConfigData {
  data: object;
  domains: string[];
}

@Injectable()
export class AppService {
  @Inject(HLOGGER_TOKEN)
  private logger: HLogger;

  @Inject(RedisService)
  private cache: RedisService;

  private log(text: string) {
    this.logger.log(text, AppService.name);
  }

  private warn(text: string) {
    this.logger.warn(text, AppService.name);
  }

  async getConfig(slug: string, origin: string) {
    const data = await this.cache.jsonGet<IConfigData>(`config-${slug}`);

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
