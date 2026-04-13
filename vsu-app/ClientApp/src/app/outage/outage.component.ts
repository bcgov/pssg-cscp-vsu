import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HealthCheckService } from '../services/health-check.service';

@Component({
  standalone: false,
  selector: 'app-outage',
  template: `
    <div class="outage-container">
      <div class="outage-content">
        <h1>Service Unavailable</h1>
        <p>
          The Victim Safety Unit application is currently down. Please retry later or contact the Victim Safety Unit.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .outage-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        padding: 2rem;
      }

      .outage-content {
        max-width: 600px;
        text-align: center;
      }

      .outage-content h1 {
        margin-bottom: 1rem;
      }

      .outage-content p {
        font-size: 1.1rem;
        line-height: 1.6;
      }
    `
  ]
})
export class OutageComponent implements OnInit {
  private readonly healthCheckService = inject(HealthCheckService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    const isHealthy = await this.healthCheckService.checkHealth();
    if (isHealthy) {
      this.router.navigateByUrl('/');
    }
  }
}
