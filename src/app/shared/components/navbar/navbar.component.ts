/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public currentTheme: 'light' | 'dark' = 'light';
  public currentLang: 'ar' | 'en' = 'en';

  constructor(
    private theme: ThemeService,
    private lang: LanguageService,
    private messages: MessagesService,
  ) {}

  ngOnInit(): void {
    this.currentTheme = this.theme.getCurrentTheme();
    this.theme.applyTheme(this.currentTheme);

    this.currentLang = this.lang.getCurrentLang();
    this.lang.applyLanguage(this.currentLang);

    this.messages.load(this.lang.toBCP47(this.currentLang));
  }

  public toggleTheme() {
    this.theme.toggleTheme();
    this.currentTheme = this.theme.getCurrentTheme();
  }

  public toggleLanguage() {
    this.lang.toggleLanguage();
    this.currentLang = this.lang.getCurrentLang();
    this.messages.load(this.lang.toBCP47(this.currentLang));
  }
}
