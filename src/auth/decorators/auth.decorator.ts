import { applyDecorators } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum.js';
import { Roles } from './roles.decorator.js';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles), // Gắn nhãn danh sách Role để RolesGuard (toàn cục) đọc
    ApiBearerAuth(), // Thêm header Authorization vào Swagger
    ApiUnauthorizedResponse({ description: 'Unauthorized' }), // Thêm mô tả Unauthorized vào Swagger
  );
}
