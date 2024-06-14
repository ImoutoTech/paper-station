import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/entities';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserAPI } from '@/api';
import { isNil } from 'lodash';
import dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  @InjectModel(User.name)
  private userRepo: Model<User>;

  private userApi: ReturnType<typeof UserAPI>;

  public constructor(private config: ConfigService) {
    const apiEnv = {
      SSO_ID: this.config.get<string>('SSO_ID'),
      SSO_URL: this.config.get<string>('SSO_URL'),
      SSO_SECRET: this.config.get<string>('SSO_SECRET'),
      SSO_REDIRECT: this.config.get<string>('SSO_REDIRECT'),
    };

    this.userApi = UserAPI(apiEnv);
  }

  async login(ticket: string) {
    const tokenRes = await this.userApi
      .authorizeToken(ticket)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        return e.response.data;
      });

    if (tokenRes.code !== 0) {
      return tokenRes;
    }

    const { access_token } = tokenRes.data;

    const userInfo = await this.userApi
      .getUserInfo(`Bearer ${access_token}`)
      .then((res) => res.data)
      .catch((e) => {
        return e.response.data;
      });

    if (userInfo.code !== 0) {
      return userInfo;
    }

    const { email, id, avatar } = userInfo.data;
    const dbUser = await this.userRepo.findOne({ id });
    if (isNil(dbUser)) {
      const user = new this.userRepo({
        id,
        email,
        avatar,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      await user.save();

      return {
        user: user.toObject(),
        token: jwt.sign(
          {
            email,
            id,
          },
          this.config.get<string>('TOKEN_SECRET'),
          {
            expiresIn: '3d',
          },
        ),
      };
    }

    // 更新用户信息
    dbUser.email = email;
    dbUser.avatar = avatar;
    await dbUser.save();

    return {
      user: dbUser,
      token: jwt.sign(
        {
          email: dbUser.email,
          id: dbUser.id,
        },
        this.config.get<string>('TOKEN_SECRET'),
        {
          expiresIn: '3d',
        },
      ),
    };
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({ id });
  }
}
