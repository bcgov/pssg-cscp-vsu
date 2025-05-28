import { Component, OnInit } from '@angular/core';
import { ConfigService } from './services/config.service';
import { Configuration } from './shared/interfaces/configuration.interface';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '';
  previousUrl: string;
  configuration: Configuration;
  error = false;
  public isNewUser: boolean;
  public isDevMode: boolean;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService
      .load()
      .then((configuration) => {
        console.log('Fetched Configuration:', configuration);
        this.configuration = configuration;
      })
      .catch((error) => {
        console.error('Failed to fetch configuration:', error);
        this.error = error;
      });
  }

  isOutage() {
    if (
      !this.configuration ||
      !this.configuration.outageEndDate ||
      !this.configuration.outageStartDate ||
      !this.configuration.outageMessage
    ) {
      return false;
    }
    const currentDate = moment().tz('America/Vancouver');
    const outageStartDate = moment(this.configuration.outageStartDate).tz('America/Vancouver');
    const outageEndDate = moment(this.configuration.outageEndDate).tz('America/Vancouver');
    return currentDate.isBetween(outageStartDate, outageEndDate, null, '[]');
  }

  generateOutageDateMessage(): string {
    const startDate = moment(this.configuration.outageStartDate).tz('America/Vancouver').format('MMMM Do YYYY, h:mm a');
    const endDate = moment(this.configuration.outageEndDate).tz('America/Vancouver').format('MMMM Do YYYY, h:mm a');
    return 'The system will be down for maintenance from ' + startDate + ' to ' + endDate;
  }

  isIE10orLower() {
    if (window.document['documentMode']) {
      return true;
    }

    return false;
  }
}
