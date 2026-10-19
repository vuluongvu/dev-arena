import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password cannot be empty' })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  confirmPassword: string;
}
