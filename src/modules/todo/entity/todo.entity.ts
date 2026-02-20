import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';

@Entity('todos')
export class TodoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
