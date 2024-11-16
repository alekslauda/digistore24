export const MessageStatus = {
  PENDING: 'pending' as 'pending',
  FAILED: 'failed' as 'failed',
  SENT: 'sent' as 'sent',
  DRAFT: 'draft' as 'draft',
};

export type MessageStatus = typeof MessageStatus[keyof typeof MessageStatus];


export class Message {
  text: string;
  status: string;
  
  constructor(message: string, status: MessageStatus) {
    this.text = message;
    this.status = status;
  }

  empty() {
    return this.text === '';
  }
}
