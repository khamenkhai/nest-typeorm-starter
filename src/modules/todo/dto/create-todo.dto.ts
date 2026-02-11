import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty({ example: 'Buy groceries', description: 'The title of the todo' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Milk, Eggs, Bread', description: 'The description of the todo', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: false, description: 'Completion status', required: false })
    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;
}
