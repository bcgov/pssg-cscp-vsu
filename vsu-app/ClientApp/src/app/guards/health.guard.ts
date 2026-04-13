import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HealthCheckService } from '../services/health-check.service';

export const healthCheckGuard: CanActivateFn = () => {
  const healthCheckService = inject(HealthCheckService);
  const router = inject(Router);

  if (healthCheckService.isHealthy() === false) {
    return router.createUrlTree(['/outage']);
  }

  return true;
};
