import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ConfigurationStore } from '../../store/configuration.store';

/**
 * Shows the application processing time notice on the forms where it is placed.
 * Controlled by the FEATURE_PROCESSING_TIME_BANNER_ENABLED / FEATURE_PROCESSING_TIME_BANNER_MESSAGE settings.
 */
@Component({
  selector: 'app-processing-time-banner',
  template: `
    @if (visible()) {
      <app-alert [message]="message()" type="info"></app-alert>
    }
  `,
  styles: `
    :host {
      display: flow-root;
      max-width: 1200px;
      margin: 0 auto;
    }

    :host ::ng-deep .alert-banner {
      padding: 10px 16px;
      margin: 12px 24px;
    }

    :host ::ng-deep .alert-banner .alert-banner__content {
      gap: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ProcessingTimeBannerComponent {
  private readonly configStore = inject(ConfigurationStore);

  readonly message = computed(() => this.configStore.featureFlags()?.processingTimeBannerMessage?.trim() ?? '');
  readonly visible = computed(
    () => (this.configStore.featureFlags()?.processingTimeBannerEnabled ?? false) && this.message().length > 0
  );
}
