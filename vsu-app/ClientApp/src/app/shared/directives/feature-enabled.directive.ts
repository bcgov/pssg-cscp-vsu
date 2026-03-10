import { Directive, effect, ElementRef, inject, Input } from '@angular/core';
import { FeatureFlagConfiguration } from 'src/app/shared/interfaces/configuration.interface';
import { ConfigurationStore } from 'src/app/store/configuration.store';

@Directive({
  selector: '[featureEnabled]',
  standalone: false
})
export class FeatureEnabledDirective {
  /**
   * The name of the relevant feature flag.
   */
  @Input('featureEnabled') featureName: keyof FeatureFlagConfiguration;
  /**
   * The value the feature flag must have for this element to be enabled.
   * If not enabled, the element will be remmoved from the DOM.
   */
  @Input('featureEnabledIf') featureEnabledIf: boolean;

  private readonly el = inject(ElementRef);
  private readonly configStore = inject(ConfigurationStore);

  constructor() {
    effect(() => {
      const configuration = this.configStore.config();
      if (configuration?.featureFlags && configuration.featureFlags[this.featureName] !== this.featureEnabledIf) {
        this.el.nativeElement.parentNode?.removeChild(this.el.nativeElement);
      }
    });
  }
}
