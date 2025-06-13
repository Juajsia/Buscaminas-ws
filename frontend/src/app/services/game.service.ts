import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  createGame(rows: number, cols: number, bombs: number): void {
    this.socket.emit('createGame', { rows, cols, bombs });
  }

  onGameCreated(): Observable<{ roomId: string; board: any[][] }> {
    return new Observable((observer) => {
      this.socket.on('gameCreated', (data) => {
        observer.next(data);
      });
    });
  }

  emitVictory(): void {
    this.socket.emit('victory');
  }

  emitGameOver(): void {
    this.socket.emit('gameOver');
  }

  onRoomClosed(): Observable<{ reason: string }> {
    return new Observable((observer) => {
      this.socket.on('roomClosed', (data) => observer.next(data));
    });
  }
}
