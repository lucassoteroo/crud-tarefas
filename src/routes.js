import { randomUUID } from "crypto"
import { buildRoutePath } from "./utils/build-route-path.js"
import { Database } from "./database.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.body

            const tasks = database.select('tasks', search ? {
                title: search,
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const {
                title,
                description,
            } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date().toLocaleDateString('pt-BR'),
                completed_at: '',
                updated_at: ''
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
]