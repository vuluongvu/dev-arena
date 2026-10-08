import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// create a decorator to get current user instead of writing req.user each controllers
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // it's JwtStrategy.validate() returned

    // if assgin @CurrentUser('userId) -> return user['userId']
    // if assgin @CurrentUser() -> return object user

    return data ? user?.[data] : user;
  },
);

/*NOTE: user[data] 'data' là kiểu thuộc tính động, có thể là string, object, number, ...
còn user.data là thuộc tính cố */
