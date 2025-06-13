import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Cell {
  value: number | 'B';
  revealed: boolean;
  flagged: boolean;
  row: number;
  col: number;
}

@Component({
  selector: 'app-board',
  imports: [FormsModule, NgClass],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  board: Cell[][] = [];
  rows: number = 8;
  cols: number = 8;
  mines: number = 10;

  gameOver = false;
  victory = false;
  gameStarted = false;

  constructor(private _gameService: GameService) {

  }

  createGame() {
    if (this.rows < 2 || this.cols < 2 || this.mines < 1) {
      alert('Parámetros inválidos');
      return;
    }

    this.gameOver = false;
    this.victory = false;
    this.gameStarted = true;

    this._gameService.createGame(this.rows, this.cols, this.mines);

    this._gameService.onGameCreated().subscribe((data) => {
      this.board = data.board.map((row: any[], rowIndex: number) =>
        row.map((val: any, colIndex: number) => ({
          value: val,
          revealed: false,
          flagged: false,
          row: rowIndex,
          col: colIndex
        }))
      );
    });
  }

  revealAllAndEnd() {
    this.revealAll();
    this.gameOver = true;
    this._gameService.emitGameOver();
    alert('Revelaste todo el tablero. Fin de la partida.');
  }

  onLeftClick(cell: Cell) {
    if (this.gameOver || cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (cell.value === 'B') {
      this.gameOver = true;
      this._gameService.emitGameOver();
      alert('💥 Perdiste');
      this.revealAll();
      return;
    }

    if (cell.value === 0) {
      this.revealAdjacent(cell.row, cell.col);
    }

    this.checkVictory();
  }

  onRightClick(event: MouseEvent, cell: Cell) {
    event.preventDefault();
    if (cell.revealed || this.gameOver) return;
    cell.flagged = !cell.flagged;
  }

  revealAdjacent(row: number, col: number) {
    const directions = [-1, 0, 1];
    for (let dr of directions) {
      for (let dc of directions) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (this.inBounds(r, c)) {
          const neighbor = this.board[r][c];
          if (!neighbor.revealed && !neighbor.flagged) {
            neighbor.revealed = true;
            if (neighbor.value === 0) {
              this.revealAdjacent(r, c);
            }
          }
        }
      }
    }
  }

  revealAll() {
    for (let row of this.board) {
      for (let cell of row) {
        cell.revealed = true;
      }
    }
  }

  inBounds(r: number, c: number): boolean {
    return r >= 0 && r < this.board.length && c >= 0 && c < this.board[0].length;
  }

  checkVictory() {
    let unrevealed = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (!cell.revealed && cell.value !== 'B') {
          unrevealed++;
        }
      }
    }
    if (unrevealed === 0) {
      this.victory = true;
      this._gameService.emitVictory();
      alert('🎉 ¡Ganaste!');
      this.revealAll();
    }
  }

  getNumberClass(cell: any): string {
    if (!cell.revealed || typeof cell.value !== 'number' || cell.value === 0) {
      return '';
    }
    return 'num-' + cell.value;
  }

}