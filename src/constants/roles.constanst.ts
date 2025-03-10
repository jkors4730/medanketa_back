import { ROLE_ADMIN, ROLE_INT, ROLE_RESP } from '../utils/common.js';

// мапа для статичных ролей
export const rolePermissionMap: Record<string, string[]> = {
  [ROLE_ADMIN]: ['*'],
  [ROLE_INT]: [
    'user:create',
    'user:update',
    'user:delete',
    'users:get',
    'survey:create',
    'survey:update',
    'survey:delete',
    'surveys:get',
    'dict:create',
    'dict:update',
    'dict:delete',
    'dicts:get',
    'dict:values:get',
  ],
  [ROLE_RESP]: [
    'user:create',
    'user:update',
    'user:delete',
    'users:get',
    'surveys:get',
  ],
};
