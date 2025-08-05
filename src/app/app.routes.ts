import { Routes } from '@angular/router';
import { DanglingCallBadComponent } from './components/dangling-call-bad/dangling-call-bad.component';
import { DanglingCallGoodComponent } from './components/dangling-call-good/dangling-call-good.component';
import { IntervalBadComponent } from './components/interval-bad/interval-bad.component';
import { IntervalGoodComponent } from './components/interval-good/interval-good.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dangling-call-bad', pathMatch: 'full' },
  { path: 'dangling-call-bad', component: DanglingCallBadComponent },
  { path: 'dangling-call-good', component: DanglingCallGoodComponent },
  { path: 'interval-bad', component: IntervalBadComponent },
  { path: 'interval-good', component: IntervalGoodComponent }
];
