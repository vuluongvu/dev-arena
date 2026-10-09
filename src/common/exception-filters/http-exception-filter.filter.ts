import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException) // only catch HTTP-Exception ex: NotFoundException, Conflict, ...
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // get current context's request information

    const request = ctx.getRequest(); // req
    const response = ctx.getResponse(); // res

    const status = exception.getStatus(); // get status code, ex: 400, 401, 200, 201

    // JSON format
    response.status(status).json({
      statusCode: status, // statusCode: 404
      message: exception.message, // message: Not found
      path: request.url, // path: users/profile/1
      timestamp: new Date().toISOString(), // timeStamp: 23:00:01
    });
  }
}

// register filter above controller route
// @UseFilters(HttpExceptionFilter) // *
// @Controller('users')
// export class UsersController {}

// use global
// main.ts
//   app.useGlobalFilters(
//     new HttpExceptionFilter(),
//   );

/*NOTE: AgrumentsHost Là 'box' để chứa context của request hiện tại và cho phép ta lấy ra những thứ liên quan đến nó như: request, response, statusCode */
/*NOTE: Tóm lại Exception Filter là công cụ để định dạng lại cấu trúc dữ liệu trước khi trả về FE*/
