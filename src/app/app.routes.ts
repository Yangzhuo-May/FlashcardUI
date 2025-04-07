import { Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import { HomeComponent } from './pages/home/home/home.component';
import { CardListComponent } from './pages/stack/components/card-list/card-list.component';
import { InputModeComponent } from './pages/input-mode/input-mode.component';
import { ChoiceModeComponent } from './pages/choice-mode/choice-mode.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'cards/:id', component: CardListComponent },
    { path: 'learn/input', component: InputModeComponent },
    { path: 'learn/choice', component: ChoiceModeComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}