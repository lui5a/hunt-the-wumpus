import { Routes } from '@angular/router';
import { GamePage } from './views/game/game.page';
import { SettingsPage } from './views/settings/settings.page';

export const routes: Routes = [
  { path: 'settings', component: SettingsPage },
  { path: 'game', component: GamePage },
  { path: '', redirectTo: '/settings', pathMatch: 'full' },
];
