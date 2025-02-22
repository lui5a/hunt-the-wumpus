import { Routes } from '@angular/router';
import { GamePage } from './views/game/game.page';
import { SettingsPage } from './views/settings/settings.page';
import { SettingsGuard } from './guards/settings.guard';

export const routes: Routes = [
  { path: 'settings', component: SettingsPage },
  { path: 'game', component: GamePage, canActivate: [SettingsGuard] },
  { path: '', redirectTo: '/settings', pathMatch: 'full' },
];
