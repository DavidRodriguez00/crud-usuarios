import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
// import { UserDetailComponent } from './components/user-detail/user-detail';
// import { UserFormComponent } from './components/user-form/user-form';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    // { path: 'user/:id', component: UserDetailComponent },
    // { path: 'newuser', component: UserFormComponent },
    // { path: 'updateuser/:id', component: UserFormComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];