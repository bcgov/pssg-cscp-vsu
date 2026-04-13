import { enableProdMode, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';

import { AppModule } from './app/app.module';
import { ConfigurationLoaderService } from './app/services/configuration-loader.service';
import { HealthCheckService } from './app/services/health-check.service';
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
        const healthCheckService = inject(HealthCheckService);
        const router = inject(Router);
        const configurationLoaderService = inject(ConfigurationLoaderService);

        const isHealthy = await healthCheckService.checkHealth();

        if (!isHealthy) {
          router.navigateByUrl('/outage');
          return;
        }

        await Promise.all([configurationLoaderService.loadConfiguration()]);
      })
    ]
  })
  .catch((err) => console.log(err));
