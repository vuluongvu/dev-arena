import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface.js';
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // 1, lấy response object của Express để đọc mã HTTP status code (200, 201...)
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    // 2, next.handle() kích hoạt Controller chạy
    // Dùng toán tử .pipe(map(...)) của RxJS để biến đổi dữ liệu trả về từ Controller
    return next.handle().pipe(
      map((data) => {
        // xử lý linh hoạt: Nếu controller có truyền custom message thì dùng, không thì mặc định là 'Success'

        const message = data?.message || 'Success';
        // nếu data ở dạng { message: '...', data: ... } thì bóc tách chuẩn
        const resultData =
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'message' in data
            ? data.data
            : data;
        // trả về data
        return {
          statusCode,
          message,
          data: resultData ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
