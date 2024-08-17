import { Injectable } from '@nestjs/common';
import { CreateConfigDto, UpdateConfigDto } from '@/dto';

@Injectable()
export class ConfigService {
  create(createConfigDto: CreateConfigDto) {
    return 'This action adds a new config';
  }

  findAll() {
    return `This action returns all config`;
  }

  findOne(id: string) {
    return `This action returns a #${id} config`;
  }

  update(id: string, updateConfigDto: UpdateConfigDto) {
    return `This action updates a #${id} config`;
  }

  remove(id: string) {
    return `This action removes a #${id} config`;
  }
}
