import { Component, Input } from '@angular/core';
import { Message } from '../../../../core/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input({ required: true }) message!: Message;
  @Input() no: any;
}
