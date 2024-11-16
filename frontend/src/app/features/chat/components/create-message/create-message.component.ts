import { Component } from '@angular/core';
import { MessageService } from '../../../../core/services/message.service';
import { Message, MessageStatus } from '../../../../core/models/message.model';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent {
  message: Message = new Message('', MessageStatus.DRAFT);
  errorMessage: string = '';

  constructor(private messageService: MessageService) {}

  onSubmit(): void {
    this.message.status = MessageStatus.PENDING;

    this.messageService.createMessage(this.message.text).subscribe({
      next: (newMessage) => {
        this.message.status = MessageStatus.SENT;
        this.messageService.add(newMessage);
        this.resetMessage();
      },
      error: (error) => {
        this.message.status = MessageStatus.FAILED;
        this.errorMessage = error;
      }
    });
  }

  resetMessage(): void {
    this.message = new Message('', MessageStatus.DRAFT);
    this.errorMessage = '';
  }
  handleChange(event: Event): void {
    const currentValue = ((event.target as HTMLInputElement).value);
    if (currentValue === '') {
      this.resetMessage();
    }
  }
}
