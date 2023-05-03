import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto'
import { DataBase } from './database.js'

const database = new DataBase()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {

            const { title, description } = request.body

            const date = new Date()

            const task = {
                id: randomUUID(),
                title: title,
                description: description,
                completed_at: null,
                created_at: date,
                updated_at: date
            }

            database.insert('tasks', task)

            return response.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {

            const { search } = request.query

            const data = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return response.end(JSON.stringify(data))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {

            const { id } = request.params

            const { title, description } = request.body

            const [task] = database.select('tasks', { id })

            if(!task) {
                response.writeHead(404).end()
            }

            database.update('tasks', id, {
                title: title ? title : task.title,
                description: description ? description : task.description,
                completed_at: task.completed_at,
                created_at: task.created_at,
                updated_at: new Date()
            })

            return response.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {

            const { id } = request.params

            const [task] = database.select('tasks', { id })

            if(!task) {
                response.writeHead(404).end()
            }

            database.delete('tasks', id)

            response.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {

            const { id } = request.params

            const [task] = database.select('tasks', { id })

            const completed_at = !!task.completed_at ? task.completed_at : new Date()

            database.update('tasks', id, {
                completed_at: completed_at
            })

            return response.writeHead(204).end()
        }
    }
]