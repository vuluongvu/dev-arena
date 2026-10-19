import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1, quét xem endpoint có yêu cầu roles cụ thể nào không
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2, nếu route không gắn @Roles -> Bất kỳ ai đã đăng nhập đều vào được
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3, lấy thông tin user từ request (đã được JwtAuthGuard gán vào từ trước)
    const { user } = context.switchToHttp().getRequest();
    // console.log('Required roles:', requiredRoles);
    // console.log('Current user:', user);
    // console.log('Current role:', user?.role);

    // 4, kiểm tra xem role của user có nằm trong danh sách requiredRoles không
    return requiredRoles.some((role) => role === user?.role);
  }
}
