/* eslint-disable @angular-eslint/no-pipe-impure */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Pipe, PipeTransform } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  constructor(private messages: MessagesService) {}

  transform(key: string): string {
    return this.messages.t(key);
  }
}
