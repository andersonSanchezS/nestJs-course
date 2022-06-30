import { Injectable } from '@nestjs/common'
import { Task, TaskStatus } from './task.model'
import { nanoid } from 'nanoid'

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    createTask(title: string, description: string): Task {
        const task: Task = {
            id: nanoid(32),
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task)
        return task
    }
}
