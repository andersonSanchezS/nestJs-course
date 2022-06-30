import { Body, Controller, Get, Post } from '@nestjs/common'
import { Task } from './task.model'
import { TasksService } from './tasks.service'
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    getTasks(): Task[] {
        return this.tasksService.getAllTasks()
    }

    @Post()
    createTask(@Body('title') title, @Body('description') description): Task {
        return this.tasksService.createTask(title, description)
    }
}
