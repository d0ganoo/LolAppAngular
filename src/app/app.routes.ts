import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ChampionsVersus } from './features/champions-versus/champions-versus';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'champions-versus', component: ChampionsVersus }
];
