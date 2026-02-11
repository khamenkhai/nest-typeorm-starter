import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshDto {
    @ApiProperty({ example: 'uuid-v4-string', description: 'The ID of the user' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'The refresh token' })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
