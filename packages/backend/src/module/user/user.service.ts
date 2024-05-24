import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/entities';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  @InjectModel(User.name)
  private userRepo: Model<User>;

  async login(body: CreateUserDto) {
    return await this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
