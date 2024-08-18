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

export interface SiteExportData {
  id: number;
  name: string;
  owner?: number;
  domains: string[];
  configs?: string[];
  created_at: Date;
  updated_at: Date;
}

@Entity({
  name: 'sites',
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
      owner: this.owner.ssoId,
      domains: this.domains,
      configs: this.configs.map((cfg) => cfg.slug),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
