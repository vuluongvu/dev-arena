import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum.js';
import { Roles } from './roles.decorator.js';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles), // Gánn nhãn danh sách role cần kiểm tra
    // UseGuards(JwtAuthGuard, RolesGuard), // Kích hoạt 2 Guard liên tiếp
  );
}
