import { Component, inject } from '@angular/core';
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

  showAnnouncementBanner = this.configStore.showAnnouncementBanner;
  outageMessage = this.configStore.outageMessage;

  isIE10orLower() {
    if (window.document['documentMode']) {
      return true;
    }

    return false;
  }
}
