import { Routes } from '@angular/router';
import { AuthFormComponent } from './features/auth/components/auth-form/auth-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ChatListComponent } from './features/chat/components/chat-list/chat-list.component';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthFormComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'chat',
    component: ChatListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
