import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

enum BoardElement {
  Empty = 0,
  Hunter = 1,
  Well = 2,
  Wall = 3,
  Wumpus = 4,
  Gold = 5,
  HunterWithGold = 6,
}
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  @Input() boardSize!: number;
  board: number[][] = [];
  hunterPosition = { row: 0, col: 0 };
  wallQuantity: number = this.boardSize;
  wumpusQuantity: number = 1;
  goldQuantity: number = 1;
  hunterArrows!: number;
  gameMessage: string = '';
  hunterKilled: boolean = false;
  hunterWithGold: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.initializeBoard();
  }
  initializeBoard() {
    const wellsQuantity = this.gameService.getWells();
    const arrowsQuantity = this.gameService.getArrows();

    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = 0;
      }
    }
    this.hunterPosition = { row: this.boardSize - 1, col: 0 };
    this.board[this.hunterPosition.row][this.hunterPosition.col] =
      BoardElement.Hunter;

    this.hunterArrows = arrowsQuantity;

    this.placeElements(wellsQuantity, BoardElement.Well);
    this.placeElements(this.wallQuantity, BoardElement.Wall);
    this.placeElements(this.wumpusQuantity, BoardElement.Wumpus);
    this.placeElements(this.goldQuantity, BoardElement.Gold);
  }

  placeElements(count: number, type: number) {
    let availableCells = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (!(row === this.boardSize - 1 && col === 0)) {
          availableCells.push({ row, col });
        }
      }
    }

    availableCells = availableCells.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < availableCells.length; i++) {
      const { row, col } = availableCells[i];
      this.board[row][col] = type;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.hunterKilled) {
      return;
    } else {
      this.gameMessage = '';
      let newRow = this.hunterPosition.row;
      let newCol = this.hunterPosition.col;
      switch (event.key) {
        case 'ArrowUp':
          if (newRow > 0) newRow--;
          break;
        case 'ArrowDown':
          if (newRow < this.boardSize - 1) newRow++;
          break;
        case 'ArrowLeft':
          if (newCol > 0) newCol--;
          break;
        case 'ArrowRight':
          if (newCol < this.boardSize - 1) newCol++;
          break;
        default:
          return;
      }
      const nextCell = this.board[newRow][newCol];

      if (nextCell === BoardElement.Wall) {
        this.gameMessage = 'wall';
        return;
      }

      if (nextCell === BoardElement.Wumpus) {
        this.gameMessage = 'wumpus';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.hunterKilled = true;
        return;
      }

      if (nextCell === BoardElement.Well) {
        this.gameMessage = 'well';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.hunterKilled = true;
        return;
      }
      if (nextCell === BoardElement.Gold) {
        this.gameMessage = 'gold';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.board[newRow][newCol] = BoardElement.HunterWithGold;
        this.hunterWithGold = true;
        return;
      }
      this.board[this.hunterPosition.row][this.hunterPosition.col] =
        BoardElement.Empty;
      this.hunterPosition = { row: newRow, col: newCol };
      this.hunterWithGold
        ? (this.board[newRow][newCol] = BoardElement.HunterWithGold)
        : (this.board[newRow][newCol] = BoardElement.Hunter);
    }
  }

  resetBoard() {
    this.initializeBoard();
    this.hunterKilled = false;
  }
}
