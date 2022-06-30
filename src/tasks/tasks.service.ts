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
        if(!find) throw new NotFoundException(`Task with id ${id} not found`)
        return find
    }

    async createTask({ title, description }: CreateTaskDto): Promise<Task> {
        const task = this.TaskRepository.create({ title, description, status: TaskStatus.OPEN })
        await this.TaskRepository.save(task)
        return task
    }


    // getAllTasks(): Task[] {
    //     return this.tasks
    // }

    // getTaskWithFilters({ status, search }: GetTasksFilterDto): Task[] {
    //     let tasks = this.getAllTasks()

    //     if (status) tasks.filter((task) => task.status === status)

    //     if (search)
    //         tasks.filter(
    //             (task) =>
    //                 task.title.includes(search) ||
    //                 task.description.includes(search),
    //         )

    //     return tasks
    // }

    // getTaskById(id: string): Task {
    //     const findTask = this.tasks.find((task) => task.id === id)
    //     if (!findTask)
    //         throw new NotFoundException(`Task with id ${id} not found`)
    //     return findTask
    // }

    // removeTask(id: string): string {
    //     const validateTask = this.getTaskById(id)
    //     this.tasks = this.tasks.filter((task) => task.id !== validateTask.id)
    //     return 'Task removed'
    // }

    // createTask({ title, description }: CreateTaskDto): Task {
    //     const task: Task = {
    //         id: nanoid(32),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }
    //     this.tasks.push(task)
    //     return task
    // }

    // updateTask(id: string, status: TaskStatus) {
    //     const task = this.getTaskById(id)
    //     this.tasks = this.tasks.map((task) =>
    //         task.id === id ? { ...task, status } : task,
    //     )
    //     return task
    // }
}
