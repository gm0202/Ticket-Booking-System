import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';
import { UserRole } from '../../models/user.entity';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @IsIn([UserRole.ADMIN, UserRole.USER])
    role!: UserRole;
}

