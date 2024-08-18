import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { UserEntity } from './User';
import { SiteEntity } from './Site';

export interface ConfigExportData {
  id: number;
  name: string;
  slug: string;
  owner?: number;
  data: string;
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

  @ManyToMany(() => SiteEntity, (s) => s.configs)
  sites: SiteEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public getData(): ConfigExportData {
    return {
      id: this.id,
      name: this.name,
      data: JSON.stringify(this.data, null, '\t'),
      owner: this.owner.ssoId,
      slug: this.slug,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
