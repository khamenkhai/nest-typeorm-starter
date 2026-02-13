import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Version } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { RolesGuard } from '../auth/roles/roles.guard';
import { UserRole } from '../users/entity/user.entity';
import { Roles } from '../auth/roles/roles.decorator';
import { ApiResponse } from 'src/common/utils/api-response';

@ApiTags('Todo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }


    @ApiOperation({ summary: 'Create a new todo' })
    @Post()
    @Roles(UserRole.USER)
    async create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
        const data = await this.todoService.create(createTodoDto, req.user);
        return ApiResponse.success('Todo created successfully', data);
    }

    @ApiOperation({ summary: 'Get all todos for the current user' })
    @Get()
    async findAll(@Request() req) {
        const result = await this.todoService.findAll(req.user.id);
        return ApiResponse.success(
            'Todos retrieved successfully',
            result.items || result,
            result.meta
        );
    }

    @ApiOperation({ summary: 'Get a specific todo by ID' })
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        const data = await this.todoService.findOne(id, req.user.id);
        return ApiResponse.success('Todo retrieved successfully', data);
    }

    @ApiOperation({ summary: 'Update a specific todo by ID' })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto, @Request() req) {
        const data = await this.todoService.update(id, updateTodoDto, req.user.id);
        return ApiResponse.success('Todo updated successfully', data);
    }

    @ApiOperation({ summary: 'Delete a specific todo by ID' })
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        await this.todoService.remove(id, req.user.id);
        return ApiResponse.success('Todo deleted successfully', null);
    }
}