import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from '../common/utils/hash.util.js';
import { ChangePasswordDto } from '../auth/dto/change-password.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // function: register new user
  async register(dto: CreateUserDto): Promise<User> {
    // check existing account by username or email
    const existingUsername = await this.userRepository.findOneBy({
      username: dto.username,
    });
    const existingEmail = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (existingUsername) {
      throw new ConflictException('Username has already taken');
    }
    if (existingEmail) {
      throw new ConflictException('Email has already taken');
    }

    // hash password
    const hashedPassword = await hashPassword(dto.password);

    // create user
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // function: update user information
  async updateUser(username: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneUser(username);

    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.userRepository.findOneBy({
        username: dto.username,
      });

      if (existingUser) {
        throw new ConflictException('username has already taken');
      }
    }

    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: dto.email,
      });
      if (existingUser) {
        throw new ConflictException('Email has already taken');
      }
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  // function: find user by username
  async findOneUser(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user)
      throw new UnauthorizedException(
        `Not found user with username: ${username}!`,
      );
    return user;
  }

  // function: find user by username with password
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  // function: find user by id with password
  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
  }

  // function: change password
  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const user = await this.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await comparePassword(
      dto.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    await this.userRepository.update(
      { id: user.id },
      { password: hashedPassword },
    );

    return { message: 'Password changed successfully' };
  }
}
