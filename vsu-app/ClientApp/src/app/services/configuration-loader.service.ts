import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfigurationStore } from '../store/configuration.store';

@Injectable({ providedIn: 'root' })
export class ConfigurationLoaderService {
  private readonly store = inject(ConfigurationStore);
  private readonly loaded$ = toObservable(this.store.loaded);

  /**
   * Triggers configuration loading and returns a Promise that resolves
   * once the store marks loading as complete (success or error).
   */
  async loadConfiguration(): Promise<void> {
    this.store.loadConfiguration();
    await firstValueFrom(this.loaded$.pipe(filter(Boolean)));
  }
}
