import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) {}

  canActivate(): boolean {
    const settings = this.gameService.getBoardSize();
    if (!settings) {
      this.router.navigate(['/settings']);
      return false;
    }
    return true;
  }
}
