import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationStore } from '../store/configuration.store';

@Component({
  selector: 'app-maintenance',
  standalone: false,
  template: `
    <div class="maintenance-container">
      <div class="maintenance-content" role="main">
        <h1 class="maintenance-title">Scheduled Maintenance</h1>
        <p class="maintenance-message">
          The Victim Safety Unit application is currently undergoing scheduled maintenance. Please try again later or
          contact the Victim Safety Unit.
        </p>
        <p class="maintenance-footer">We apologize for the inconvenience and appreciate your patience.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .maintenance-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        padding: 2rem;
        text-align: center;
      }
      .maintenance-content {
        max-width: 600px;
        width: 100%;
      }
      .maintenance-title {
        font-size: 36px;
        font-weight: 700;
        color: #036;
        margin-bottom: 20px;
      }
      .maintenance-message {
        font-size: 16px;
        color: #333;
        margin-bottom: 12px;
        line-height: 1.6;
      }
      .maintenance-footer {
        margin-top: 24px;
        font-size: 14px;
        color: #6c757d;
      }
    `
  ]
})
export class MaintenanceComponent {
  constructor() {
    const configStore = inject(ConfigurationStore);
    const router = inject(Router);

    effect(() => {
      if (!configStore.maintenanceMode()) {
        router.navigateByUrl('/');
      }
    });
  }
}
