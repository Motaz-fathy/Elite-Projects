// eslint-disable-next-line max-classes-per-file
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveConfigModule } from '@deejayy/reactive-config';
import { RuntimeLocalizerModule } from '@deejayy/runtime-localizer';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { ApiConnector } from '@deejayy/api-caller';
import { ApiClientService } from '@shared/lib/custom-api-connector.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TPipe } from './shared/pipes/t.pipe';

export class ConfigVars {
  public apiUrl!: string;
}

@NgModule({
  declarations: [AppComponent, NavbarComponent, TPipe],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'Angular 17 Bootstrap',
      maxAge: 200,
      logOnly: environment.production,
    }),
    ReactiveConfigModule.forRoot(ConfigVars, { configPath: environment.config }),
    RuntimeLocalizerModule.forRoot([
      {
        lang: 'en-US',
        path: '/assets/messages/messages.en-US.json',
      },
      {
        lang: 'ar-AR',
        path: '/assets/messages/messages.ar-AR.json',
      },
    ]),
  ],
  providers: [{ provide: ApiConnector, useClass: ApiClientService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
