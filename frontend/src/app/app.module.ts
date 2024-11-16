import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './features/auth/components/auth-form/auth-form.component';
import { MessageComponent } from './features/chat/components/message/message.component';
import { ChatListComponent } from './features/chat/components/chat-list/chat-list.component';
import { CreateMessageComponent } from './features/chat/components/create-message/create-message.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    MessageComponent,
    ChatListComponent,
    CreateMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
