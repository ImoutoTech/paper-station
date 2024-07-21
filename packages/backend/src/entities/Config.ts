import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './User';

@Schema()
export class Config {
  @Prop()
  id: number;

  @Prop()
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  created_at: string;
}

export type ConfigDocument = HydratedDocument<Config>;

export const ConfigSchema = SchemaFactory.createForClass(Config);

export interface ConfigExportData {
  id: number;
  name: string;
  slug: string;
  owner?: UserEntity;
  data: object;
  created_at: Date;
  updated_at: Date;
}

@Entity({
  name: 'configs',
})
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  slug: string;

  @ManyToOne(() => UserEntity, (u) => u.configs)
  owner: UserEntity;

  @Column({
    type: 'json',
    nullable: true,
  })
  data: object;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public getData(): ConfigExportData {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      owner: this.owner,
      slug: this.slug,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
