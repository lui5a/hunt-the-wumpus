import { Component, OnInit } from '@angular/core';
import { BoardComponent } from '../../components/board/board.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './game.page.html',
  styleUrl: './game.page.scss',
})
export class GamePage implements OnInit {
  boardSize!: number | null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.boardSize = this.gameService.getBoardSize();
  }
}
