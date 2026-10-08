import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    // ưu tiên đọc decorator ở method trước (@Public() trên hàm login)
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1, dùng relector quét xem route hiện tại có dán nhãn @Public() không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Quét ở cấp Method
      context.getClass(), // Quét ở cấp Controller
    ]);

    // 2, nếu có nhãn @Public() -> Cho phép truy cập ngay, không cần JWT token
    if (isPublic) {
      return true;
    }

    // 3. Nếu KHÔNG có nhãn -> Chuyển tiếp cho AuthGuard('jwt') mặc định để check JWT
    return super.canActivate(context);
  }
}
