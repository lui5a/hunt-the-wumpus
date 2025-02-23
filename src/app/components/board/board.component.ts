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

enum Direction {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
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
  wallQuantity!: number;
  wumpusQuantity: number = 1;
  goldQuantity: number = 1;
  hunterArrows!: number;
  gameMessage: string = '';
  gameOver: boolean = false;
  hunterWithGold: boolean = false;
  lastDirection: Direction | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.initializeBoard();
    this.lastDirection = Direction.ArrowUp;
  }
  initializeBoard() {
    this.gameMessage = '';
    const wellsQuantity = this.gameService.getWells();
    const arrowsQuantity = this.gameService.getArrows();
    this.wallQuantity = wellsQuantity;

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

    this.checkPerceptions(this.hunterPosition.row, this.hunterPosition.col);
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
    if (this.gameOver) {
      return;
    } else {
      if (event.key === ' ') {
        this.shootArrow();
      }
      if (event.key === 'a' || event.key === 'A') {
        this.turnLeft();
        return;
      }

      if (event.key === 'z' || event.key === 'Z') {
        this.turnRight();
        return;
      }
      // this.gameMessage = '';
      let newRow = this.hunterPosition.row;
      let newCol = this.hunterPosition.col;
      switch (event.key) {
        case 'ArrowUp':
          if (newRow > 0) newRow--;
          this.lastDirection = Direction.ArrowUp;
          break;
        case 'ArrowDown':
          if (newRow < this.boardSize - 1) newRow++;
          this.lastDirection = Direction.ArrowDown;
          break;
        case 'ArrowLeft':
          if (newCol > 0) newCol--;
          this.lastDirection = Direction.ArrowLeft;
          break;
        case 'ArrowRight':
          if (newCol < this.boardSize - 1) newCol++;
          this.lastDirection = Direction.ArrowRight;
          break;
        default:
          return;
      }
      const nextCell = this.board[newRow][newCol];

      if (nextCell === BoardElement.Wall) {
        this.gameMessage = 'Ouch! You hit a wall';
        return;
      }

      if (nextCell === BoardElement.Wumpus) {
        this.gameMessage = 'R.I.P. The Wumpus got you';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.gameOver = true;
        return;
      }

      if (nextCell === BoardElement.Well) {
        this.gameMessage = 'R.I.P. You just fall on a well';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.gameOver = true;
        return;
      }
      if (nextCell === BoardElement.Gold) {
        this.gameMessage =
          'Great, you got the gold!!!! Now go back to the starting point';
        this.board[this.hunterPosition.row][this.hunterPosition.col] =
          BoardElement.Empty;
        this.hunterPosition = { row: newRow, col: newCol };
        this.board[newRow][newCol] = BoardElement.HunterWithGold;
        this.hunterWithGold = true;
        return;
      }

      if (nextCell === BoardElement.Empty) {
        this.gameMessage = '';
      }

      this.board[this.hunterPosition.row][this.hunterPosition.col] =
        BoardElement.Empty;

      this.hunterPosition = { row: newRow, col: newCol };

      this.hunterWithGold
        ? (this.board[newRow][newCol] = BoardElement.HunterWithGold)
        : (this.board[newRow][newCol] = BoardElement.Hunter);

      this.checkPerceptions(newRow, newCol);

      if (
        this.hunterPosition.row === this.boardSize - 1 &&
        this.hunterPosition.col === 0 &&
        this.hunterWithGold
      ) {
        this.gameMessage = 'Great, you won!';
        this.gameOver = true;
      }
    }
  }

  getAdjacentCells(row: number, col: number): { row: number; col: number }[] {
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];

    const adjacentCells = [];

    for (let dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (
        newRow >= 0 &&
        newRow < this.boardSize &&
        newCol >= 0 &&
        newCol < this.boardSize
      ) {
        adjacentCells.push({ row: newRow, col: newCol });
      }
    }

    return adjacentCells;
  }

  checkPerceptions(row: number, col: number) {
    const adjacentCells = this.getAdjacentCells(row, col);

    adjacentCells.forEach((cell) => {
      if (this.board[cell.row][cell.col] === BoardElement.Wumpus) {
        this.gameMessage = `Carefull smells like Wumpus, don't be the hunted one`;
      }
    });

    adjacentCells.forEach((cell) => {
      if (this.board[cell.row][cell.col] === BoardElement.Well) {
        this.gameMessage = `Be Careful is getting windy, don't fall`;
      }
    });

    adjacentCells.forEach((cell) => {
      if (this.board[cell.row][cell.col] === BoardElement.Gold) {
        this.gameMessage = 'There is something shinning near by';
      }
    });
  }

  shootArrow() {
    if (this.hunterArrows <= 0) {
      this.gameMessage = 'Empty';
      return;
    } else if (this.lastDirection) {
      this.hunterArrows--;

      let arrowRow = this.hunterPosition.row;
      let arrowCol = this.hunterPosition.col;

      const directions = {
        ArrowUp: { row: -1, col: 0 },
        ArrowDown: { row: 1, col: 0 },
        ArrowLeft: { row: 0, col: -1 },
        ArrowRight: { row: 0, col: 1 },
      };

      const move = directions[this.lastDirection];

      while (true) {
        arrowRow += move.row;
        arrowCol += move.col;

        if (
          arrowRow < 0 ||
          arrowRow >= this.boardSize ||
          arrowCol < 0 ||
          arrowCol >= this.boardSize
        ) {
          this.gameMessage = 'Arrow out';
          return;
        }

        if (this.board[arrowRow][arrowCol] === BoardElement.Wall) {
          this.gameMessage = 'You hit a wall';
          return;
        }
        if (this.board[arrowRow][arrowCol] === BoardElement.Wumpus) {
          this.gameMessage = 'Great! you hit the Wumpus';
          this.board[arrowRow][arrowCol] = BoardElement.Empty;
          return;
        }
      }
    }
  }

  turnLeft() {
    const directions = [
      Direction.ArrowUp,
      Direction.ArrowLeft,
      Direction.ArrowDown,
      Direction.ArrowRight,
    ];
    const currentIndex = directions.indexOf(
      this.lastDirection ?? Direction.ArrowLeft
    );
    this.lastDirection = directions[(currentIndex + 1) % 4];
    var message = this.lastDirection.replace('Arrow', '');

    this.gameMessage = `You're facing ${message}`;
  }

  turnRight() {
    const directions = [
      Direction.ArrowUp,
      Direction.ArrowRight,
      Direction.ArrowDown,
      Direction.ArrowLeft,
    ];
    const currentIndex = directions.indexOf(
      this.lastDirection ?? Direction.ArrowRight
    );
    this.lastDirection = directions[(currentIndex + 1) % 4];
    var message = this.lastDirection.replace('Arrow', '');

    this.gameMessage = `You're facing ${message}`;
  }

  resetBoard() {
    this.initializeBoard();
    this.gameOver = false;
  }
}
