import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface HealthCheckResponse {
  status: string;
  checks: Array<{
    name: string;
    status: string;
    description: string | null;
  }>;
}

@Injectable({ providedIn: 'root' })
export class HealthCheckService {
  private readonly http = inject(HttpClient);

  private readonly _isHealthy = signal<boolean | null>(null);
  readonly isHealthy = this._isHealthy.asReadonly();

  /**
   * Calls the /hc endpoint and returns true if the API is Healthy or Degraded.
   * Returns false when the status is Unhealthy or when the request itself fails.
   * The result is also stored in the `isHealthy` signal.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.get<HealthCheckResponse>('/vsuwebforms/hc'));
      const healthy = response.checks.every((c) => c.status === 'Healthy');
      this._isHealthy.set(healthy);
      return healthy;
    } catch {
      this._isHealthy.set(false);
      return false;
    }
  }
}
