import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { comparePassword } from '../common/utils/hash.util.js';
import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // function: register user account
  async register(dto: RegisterDto) {
    const user = await this.usersService.register(dto);
    return this.signToken(user.id, user.username, user.role);
  }

  // function: login account
  async login(dto: LoginDto) {
    const user = await this.usersService.findOneUser(dto.username); // find account

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = comparePassword(dto.password, user.password); // check password

    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.signToken(user.id, user.username, user.role);
  }

  // function: sign Token
  private async signToken(userId: number, username: string, role: Role) {
    const payload = { sub: userId, username, role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
