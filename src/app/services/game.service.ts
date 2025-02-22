import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private boardSize!: number;
  private wells!: number;
  private arrows!: number;

  setGameSettings(cells: number, wells: number, arrows: number) {
    this.boardSize = cells;
    this.wells = wells;
    this.arrows = arrows;
  }

  getBoardSize(): number {
    return this.boardSize;
  }

  getWells(): number {
    return this.wells;
  }

  getArrows(): number {
    return this.arrows;
  }
}
