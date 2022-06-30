import { Injectable } from '@nestjs/common'
import { Task, TaskStatus } from './task.model'
import { nanoid } from 'nanoid'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTaskWithFilters({ status, search }: GetTasksFilterDto): Task[] {
        let tasks = this.getAllTasks()

        if (status) tasks.filter((task) => task.status === status)

        if (search)
            tasks.filter(
                (task) =>
                    task.title.includes(search) ||
                    task.description.includes(search),
            )

        return tasks
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id === id)
    }

    removeTask(id: string): string {
        const validateTask = this.tasks.find((task) => task.id === id)
        if (validateTask) {
            this.tasks = this.tasks.filter((task) => task.id !== id)
            return 'Task removed'
        } else {
            return 'Task not found'
        }
    }

    createTask({ title, description }: CreateTaskDto): Task {
        const task: Task = {
            id: nanoid(32),
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task)
        return task
    }

    updateTask(id: string, status: TaskStatus) {
        const task = this.getTaskById(id)
        if (task) {
            this.tasks = this.tasks.map((task) =>
                task.id === id ? { ...task, status } : task,
            )
            return task
        } else {
            return null
        }
    }
}
