import { randomUUID } from "crypto"
import { buildRoutePath } from "./utils/build-route-path.js"
import { Database } from "./database.js"
import { processFile } from "./utils/import-csv.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.body

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: async (req, res) => {
            const tasks = database.select('tasks', '' ? {
                title: '',
                description: ''
            } : null)

            if (tasks.length === 0 && req.body.title === '') {
                try {
                    const records = await processFile('tasks');

                    for (const record of records) {
                        const { title, description } = record

                        const task = {
                             id: randomUUID(),
                             title,
                             description,
                             created_at: new Date().toLocaleDateString('pt-BR'),
                             completed_at: '',
                             updated_at: ''
                         }

                         database.insert('tasks', task);
                    }

                    return res.writeHead(201).end()
                } catch {
                    return res.writeHead(500).end()
                }
            } else if (tasks.length > 0 && req.body.title !== '') {
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
            } else {
                return res.writeHead(500).end()
            }
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            database.update('tasks', id, {
                title,
                description
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params

            database.delete('tasks', id)
            
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/task/:id/:status'),
        handler: (req, res) => {
            const { id, status } = req.params

            database.updateStatus('tasks', id, {
                status
            })

            return res.writeHead(204).end()
        }
    }
]