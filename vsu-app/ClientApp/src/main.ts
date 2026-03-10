import { enableProdMode, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { ConfigurationStore } from './app/store/configuration.store';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    applicationProviders: [
      provideZoneChangeDetection(),
      provideAppInitializer(async () => {
        await Promise.all([inject(ConfigurationStore).loadConfiguration()]);
      })
    ]
  })
  .catch((err) => console.log(err));
