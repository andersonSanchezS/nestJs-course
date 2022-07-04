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
    /**
     * @type {Repository<Task>}
     * se inyecta el repositorio de la entidad Task
     * para poder interactuar con su tabla en la base de datos
     */
    constructor(
        @InjectRepository(Task)
        private readonly TaskRepository: Repository<Task>,
    ) {}

    /**
     *
     * @param id id de la tarea
     * @param user usuario al que pertenece la tarea
     * @returns Task
     */
    async getTaskById(id: string, user: User): Promise<Task> {
        const find = await this.TaskRepository.findOne({
            where: { id, user },
        })
        if (!find) throw new NotFoundException(`Task with id ${id} not found`)
        return find
    }

    /**
     *
     * @param title titulo de la tarea
     * @param description descripción de la tarea
     * @param user usuario al que se le asigna la tarea
     * @returns Task
     */
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

    /**
     * obtener todas las tareas de un usuario
     * ademas de filtrar por estado y términos de búsqueda
     * @param status estado de la tarea  - opcional
     * @param search termino de búsqueda - opcional
     * @param user usuario al que pertenece la tarea
     * @returns Task[]
     */
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

    /**
     * eliminar una tarea
     * @param id id de la tarea
     * @param user usuario al que le pertenece la tarea
     * @returns void
     */
    async removeTask(id: string, user: User): Promise<any> {
        const result = await this.TaskRepository.delete({ id, user })
        if (result.affected === 0)
            throw new NotFoundException(`Task with id ${id} not found`)
        return { result }
    }

    /**
     * actualizar el estado de una tarea
     * @param id id de la tarea
     * @param status estado de la tarea
     * @param user usuario al que le pertenece la tarea
     * @returns Task
     */
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
