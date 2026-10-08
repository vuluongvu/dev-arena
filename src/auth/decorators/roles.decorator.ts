import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum.js';

export const ROLES_KEY = 'roles';

// Cho phép truyền 1 hoặc nhiều role: @Roles(Role.ADMIN) hoặc @Roles(Role.ADMIN, Role.USER)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
