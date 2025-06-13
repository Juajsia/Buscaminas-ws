import { io } from './app.js'
import GameManager from './game/gameManager.js'

const gameManager = new GameManager()

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`)

  socket.on('createGame', ({ rows, cols, bombs }) => {
    const { roomId, board } = gameManager.createNewGame(socket.id, rows, cols, bombs)
    socket.join(roomId)
    socket.emit('gameCreated', { roomId, board })
    console.log(`Juego creado en sala: ${roomId}`)
  })

  socket.on('victory', () => {
    const roomId = gameManager.playerRooms[socket.id]
    console.log(`Jugador ${socket.id} ganó en sala ${roomId}`)
    io.to(roomId).emit('roomClosed', { reason: 'victory' })
    gameManager.removeRoom(roomId)
  })

  socket.on('gameOver', () => {
    const roomId = gameManager.playerRooms[socket.id]
    console.log(`Jugador ${socket.id} perdió en sala ${roomId}`)
    io.to(roomId).emit('roomClosed', { reason: 'defeat' })
    gameManager.removeRoom(roomId)
  })

  socket.on('disconnect', () => {
    gameManager.removePlayer(socket.id)
    console.log(`Usuario desconectado: ${socket.id}`)
  })
})
