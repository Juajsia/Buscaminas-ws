import { createBoard } from './boardGenerator.js'
import { v4 as uuidv4 } from 'uuid'

class GameManager {
  constructor () {
    this.games = {}
    this.playerRooms = {}
  }

  createNewGame (socketId, rows, cols, bombs) {
    const roomId = uuidv4()
    const board = createBoard(rows, cols, bombs)
    this.games[roomId] = {
      hostId: socketId,
      board
    }
    this.playerRooms[socketId] = roomId
    return { roomId, board }
  }

  removePlayer (socketId) {
    const roomId = this.playerRooms[socketId]
    if (roomId) {
      delete this.games[roomId]
      delete this.playerRooms[socketId]
    }
  }

  removeRoom (roomId) {
    delete this.games[roomId]
    for (const [id, room] of Object.entries(this.playerRooms)) {
      if (room === roomId) delete this.playerRooms[id]
    }
  }
}

export default GameManager
