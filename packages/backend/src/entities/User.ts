import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ConfigEntity } from './Config';
import { SiteEntity } from './Site';

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  created_at: string;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

export interface UserExportData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  configs?: ConfigEntity[];
  sites?: SiteEntity[];
  created_at: Date;
  updated_at: Date;
}

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: false,
  })
  email: string;

  @Column({
    default: null,
  })
  avatar: string;

  @Column({
    nullable: false,
    unique: true,
  })
  ssoId: number;

  @OneToMany(() => ConfigEntity, (c) => c.owner)
  configs: ConfigEntity[];

  @OneToMany(() => SiteEntity, (c) => c.owner)
  sites: SiteEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public getData(): UserExportData {
    return {
      id: this.ssoId,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      configs: this.configs,
      sites: this.sites,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
