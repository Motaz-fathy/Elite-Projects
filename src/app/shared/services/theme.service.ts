import { Injectable } from '@angular/core';

type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'app.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public getCurrentTheme(): ThemeMode {
    const saved = (localStorage.getItem(THEME_KEY) as ThemeMode) || null;
    return saved ?? 'light';
  }

  public applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, mode);
  }

  public toggleTheme() {
    const next: ThemeMode = this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }
}
