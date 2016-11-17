import { Routes } from '@angular/router';
import { Page1Component } from './page1.component';
import { Page2Component } from './page2.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/page1', pathMatch: 'full' },
  { path: 'page1', component: Page1Component },
  { path: 'page2', component: Page2Component }
];

