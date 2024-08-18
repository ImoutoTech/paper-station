import { ConfigEntity } from './Config';
import { SiteEntity } from './Site';
import { UserEntity } from './User';

export * from './User';
export * from './Config';
export * from './Site';

export const ENTITY_LIST = [UserEntity, ConfigEntity, SiteEntity];
