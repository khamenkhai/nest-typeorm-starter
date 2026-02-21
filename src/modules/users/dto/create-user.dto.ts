import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ enum: UserRole, default: UserRole.USER, description: 'The role of the user' })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
