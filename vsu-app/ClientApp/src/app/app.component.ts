import { Component, computed, inject } from '@angular/core';
import moment from 'moment-timezone';
import { ConfigurationStore } from './store/configuration.store';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  previousUrl: string;
  public isNewUser: boolean;
  public isDevMode: boolean;

  private readonly configStore = inject(ConfigurationStore);

  configuration = this.configStore.config;
  error = computed(() => this.configStore.error());

  isOutage() {
    const config = this.configuration();
    if (!config || !config.outageEndDate || !config.outageStartDate || !config.outageMessage) {
      return false;
    }
    const currentDate = moment().tz('America/Vancouver');
    const outageStartDate = moment(config.outageStartDate).tz('America/Vancouver');
    const outageEndDate = moment(config.outageEndDate).tz('America/Vancouver');
    return currentDate.isBetween(outageStartDate, outageEndDate, null, '[]');
  }

  generateOutageDateMessage(): string {
    const config = this.configuration();
    const startDate = moment(config.outageStartDate).tz('America/Vancouver').format('MMMM Do YYYY, h:mm a');
    const endDate = moment(config.outageEndDate).tz('America/Vancouver').format('MMMM Do YYYY, h:mm a');
    return 'The system will be down for maintenance from ' + startDate + ' to ' + endDate;
  }

  isIE10orLower() {
    if (window.document['documentMode']) {
      return true;
    }

    return false;
  }
}
