import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import moment from 'moment-timezone';
import { pipe, tap } from 'rxjs';
import { ConfigurationService } from '../../api/configuration/configuration.service';
import { Configuration } from '../shared/interfaces/configuration.interface';

type ConfigurationState = {
  configuration: Configuration | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: ConfigurationState = {
  configuration: null,
  loading: false,
  loaded: false,
  error: null
};

export const ConfigurationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ configuration }) => ({
    config: computed(() => configuration()),
    featureFlags: computed(() => configuration()?.featureFlags ?? null),
    outageMessage: computed(() => configuration()?.outageMessage ?? null),
    outageStartDate: computed(() => configuration()?.outageStartDate ?? null),
    outageEndDate: computed(() => configuration()?.outageEndDate ?? null)
  })),
  withComputed((store) => ({
    showAnnouncementBanner: computed(() => {
      const message = store.outageMessage();
      const startDate = store.outageStartDate();
      const endDate = store.outageEndDate();
      if (!message || !startDate || !endDate) return false;
      const current = moment().tz('America/Vancouver');
      const start = moment(startDate).tz('America/Vancouver');
      const end = moment(endDate).tz('America/Vancouver');
      return current.isBetween(start, end, null, '[]');
    })
  })),
  withMethods((store, configurationService = inject(ConfigurationService)) => ({
    loadConfiguration: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        tap(() => {
          configurationService.getApiConfiguration<Configuration>().subscribe({
            next: (config) => {
              patchState(store, {
                configuration: config,
                loading: false,
                loaded: true,
                error: null
              });
            },
            error: (error) => {
              console.error('Failed to fetch configuration:', error);
              const errorMessage = error?.message || 'Failed to load configuration';
              patchState(store, {
                loading: false,
                loaded: true,
                error: errorMessage
              });
            }
          });
        })
      )
    )
  }))
);
