import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly TaskRepository: Repository<Task>,
    ) {}

    async getTaskById(id: string, user: User): Promise<Task> {
        const find = await this.TaskRepository.findOne({
            where: { id, user },
        })
        if (!find) throw new NotFoundException(`Task with id ${id} not found`)
        return find
    }

    async createTask(
        { title, description }: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        const task = this.TaskRepository.create({
            title,
            description,
            user,
            status: TaskStatus.OPEN,
        })
        await this.TaskRepository.save(task)
        return task
    }

    async getTaskWithFilters(
        { status, search }: GetTasksFilterDto,
        user: User,
    ): Promise<Task[]> {
        const tasks = await this.TaskRepository.createQueryBuilder('task')

        tasks.where({ user })

        if (status) tasks.andWhere('task.status = :status', { status })
        if (search)
            tasks.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            )

        return tasks.getMany()
    }

    async removeTask(id: string, user: User): Promise<any> {
        const result = await this.TaskRepository.delete({ id, user })
        if (result.affected === 0)
            throw new NotFoundException(`Task with id ${id} not found`)
        return { result }
    }

    async updateTask(
        id: string,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user)
        task.status = status

        await this.TaskRepository.save(task)

        return task
    }
}
