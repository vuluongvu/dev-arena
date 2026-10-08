import { SetMetadata } from '@nestjs/common';

// Đặt 1 key định danh để Reflector tìm kiếm
export const IS_PUBLIC_KEY = 'isPublic';

// Decorator @Public() sẽ gán metadata: isPublic = true cho route
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
