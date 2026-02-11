import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './entity/todo.entity';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoEntity)
        private todoRepository: Repository<TodoEntity>,
    ) { }

    async create(createTodoDto: any, user: UserEntity): Promise<TodoEntity> {
        const todo = this.todoRepository.create({
            ...createTodoDto,
            user,
        });
        return (this.todoRepository.save(todo) as any);
    }

    async findAll(userId: string, page: number = 1, limit: number = 10) {

        const [items, totalItems] = await this.todoRepository.findAndCount({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });


        const totalPages = Math.ceil(totalItems / limit);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    }

    async findOne(id: string, userId: string): Promise<TodoEntity> {
        const todo = await this.todoRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!todo) {
            throw new NotFoundException(`Todo with ID ${id} not found`);
        }
        return todo;
    }

    async update(id: string, updateTodoDto: any, userId: string): Promise<TodoEntity> {
        const todo = await this.findOne(id, userId);
        Object.assign(todo, updateTodoDto);
        return this.todoRepository.save(todo);
    }

    async remove(id: string, userId: string): Promise<void> {
        const todo = await this.findOne(id, userId);
        await this.todoRepository.remove(todo);
    }
}
