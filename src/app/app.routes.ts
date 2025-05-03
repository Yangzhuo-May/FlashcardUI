import { Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import { HomeComponent } from './pages/home/home/home.component';
import { InputModeComponent } from './pages/input-mode/input-mode.component';
import { ChoiceModeComponent } from './pages/choice-mode/choice-mode.component';
import { StackComponent } from './pages/stack/stack/stack.component';
import { LoginComponent } from './pages/aa/login/login.component';
import { RegisterComponent } from './pages/aa/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome/welcome.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'user', component: HomeComponent },
    { path: 'cards/:id', component: StackComponent },
    { path: 'learn/input', component: InputModeComponent },
    { path: 'learn/choice', component: ChoiceModeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}