import { Injectable, NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly TaskRepository: Repository<Task>,
    ) {}

    async getTaskById(id: string): Promise<Task> {
        const find = await this.TaskRepository.findOne(id)
        if (!find) throw new NotFoundException(`Task with id ${id} not found`)
        return find
    }

    async createTask({ title, description }: CreateTaskDto): Promise<Task> {
        const task = this.TaskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
        })
        await this.TaskRepository.save(task)
        return task
    }

    async getAllTasks(): Promise<Task[]> {
        return await this.TaskRepository.find()
    }

    async getTaskWithFilters({
        status,
        search,
    }: GetTasksFilterDto): Promise<Task[]> {
        const tasks = await this.TaskRepository.createQueryBuilder('task')

        if (status) tasks.andWhere('task.status = :status', { status })
        if (search)
            tasks.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                { search: `%${search}%` },
            )

        return tasks.getMany()
    }

    async removeTask(id: string): Promise<any> {
        const result = await this.TaskRepository.delete(id)
        if (result.affected === 0)
            throw new NotFoundException(`Task with id ${id} not found`)
        return { result }
    }

    async updateTask(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id)
        task.status = status

        await this.TaskRepository.save(task)

        return task
    }
}
