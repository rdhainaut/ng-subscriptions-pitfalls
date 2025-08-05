import { Routes } from '@angular/router';
import { BadComponent } from './components/bad/bad.component';
import { GoodComponent } from './components/good/good.component';

export const routes: Routes = [
  { path: '', redirectTo: '/bad', pathMatch: 'full' },
  { path: 'bad', component: BadComponent },
  { path: 'good', component: GoodComponent }
];
