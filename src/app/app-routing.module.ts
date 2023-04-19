import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { TournamentComponent } from './tournament/tournament.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/tournaments', component: HistoryComponent, canActivate: [AuthenticationGuard]},
  {path: 'user/:username', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'tournament/:tournamentString', component: TournamentComponent, canActivate: [AuthenticationGuard]},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
