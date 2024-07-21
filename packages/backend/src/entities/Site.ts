import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { ConfigEntity } from './Config';
import { UserEntity } from './User';

@Schema()
export class Site {
  @Prop([String])
  domains: string[];

  @Prop()
  owner: number;

  @Prop()
  name: string;

  @Prop([Number])
  configs: number[];

  @Prop()
  created_at: string;

  @Prop()
  updated_at: string;
}

export type SiteDocument = HydratedDocument<Site>;

export const SiteSchema = SchemaFactory.createForClass(Site);

export interface SiteExportData {
  id: number;
  name: string;
  owner?: UserEntity;
  domains: string[];
  configs?: ConfigEntity[];
  created_at: Date;
  updated_at: Date;
}

@Entity({
  name: 'users',
})
export class SiteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'simple-array',
  })
  domains: string[];

  @ManyToOne(() => UserEntity, (u) => u.sites)
  owner: UserEntity;

  @ManyToMany(() => ConfigEntity, (c) => c.sites)
  @JoinTable()
  configs: ConfigEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public getData(): SiteExportData {
    return {
      id: this.id,
      name: this.name,
      owner: this.owner,
      domains: this.domains,
      configs: this.configs,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
