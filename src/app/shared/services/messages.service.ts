import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type MessagesMap = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private messages: MessagesMap = {};

  constructor(private http: HttpClient) {}

  public load(langBcp47: 'en-US' | 'ar-AR'): void {
    const url = `/assets/messages/messages.${langBcp47}.json`;
    this.http.get<MessagesMap>(url).subscribe({
      next: (data) => {
        this.messages = data ?? {};
      },
      error: () => {
        this.messages = {};
      },
    });
  }

  public t(key: string): string {
    return this.messages[key] ?? key;
  }
}
