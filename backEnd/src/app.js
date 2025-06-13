import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

export const server = createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })
