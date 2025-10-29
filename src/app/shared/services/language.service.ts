import { Injectable } from '@angular/core';

type LangCode = 'ar' | 'en';

const LANG_KEY = 'app.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public getCurrentLang(): LangCode {
    const saved = (localStorage.getItem(LANG_KEY) as LangCode) || null;
    return saved ?? 'en';
  }

  public applyLanguage(lang: LangCode) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(LANG_KEY, lang);
  }

  public toggleLanguage() {
    const next: LangCode = this.getCurrentLang() === 'ar' ? 'en' : 'ar';
    this.applyLanguage(next);
  }

  public toBCP47(lang: LangCode): 'ar-AR' | 'en-US' {
    return lang === 'ar' ? 'ar-AR' : 'en-US';
  }
}
