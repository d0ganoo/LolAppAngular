import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ChampionsStatsViewer } from './features/champions-stats-viewer/champions-stats-viewer';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'champions-stats-viewer', component: ChampionsStatsViewer }
];
