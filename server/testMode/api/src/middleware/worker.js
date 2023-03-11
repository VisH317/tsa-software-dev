import { createClient } from 'redis'
import { spawn } from 'node:child_process'

const client = createClient({
    host: 'localhost',
    port: 6341
})

await client.connect()

process.on('message', message => {
    
})