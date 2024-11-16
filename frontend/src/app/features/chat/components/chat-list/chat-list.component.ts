import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { Message } from '../../../../core/models/message.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  messages$!: Observable<Message[]>;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messages$ = this.messageService.messages$;

    this.messageService.all().subscribe({
      error: (error) => console.error('Error fetching messages:', error),
    });
  }
}
