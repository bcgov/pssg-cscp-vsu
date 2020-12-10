import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client.service';
import { CornetService } from '../services/cornet.service';
import { NotificationService } from '../services/notification.service';
import { FormBase } from '../shared/form-base';
import { IClientDetails, INotification } from '../shared/interfaces/client-details.interface';
import { IClient, IClientParameters } from '../shared/interfaces/client-search.interface';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent extends FormBase implements OnInit {
  isLoading: boolean = false;

  client_details: IClientDetails = {};

  username: string = "";
  fullname: string = "";
  client: string = "";

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private clientService: ClientService,
    private cornetService: CornetService,
  ) {
    super();
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') || "test";
    this.fullname = this.route.snapshot.paramMap.get('fullname') || "test";
    this.client = this.route.snapshot.paramMap.get('client') || "test";

    this.form = this.fb.group({
      lastName: [""],
      middleName: [""],
      firstName: [""],
      isCurrentName: [""],
    });

    this.route.params.subscribe(q => {
      if (q && q.clientNumber) {
        this.getClientDetails(q.clientNumber);
      }
    });
  }

  getClientDetails(clientNumber) {
    let parameters: IClientParameters = {
      search_type: 'ID',
      identifier_type: 'CSNO',
      identifier_text: clientNumber,

      username: this.username,
      fullname: this.fullname,
      client: this.client,
    };

    this.cornetService.getClients(parameters).subscribe((res) => {
      // console.log(res);
      if (res && res.clients) {
        Object.assign(this.client_details, res.clients[0]);
      }
    }, (err) => {
      console.log(err);
    });

    this.notificationService.getNotificationsForClient(clientNumber).subscribe((res) => {
      // console.log(res);
      if (res && res.value && res.value.length) {
        this.client_details.notifications = [];
        res.value.forEach((n: any) => {
          this.client_details.notifications.push({
            notificationId: n.vsd_cornetnotificationid,
            eventId: n.vsd_event_id,
            eventDate: new Date(n.vsd_eventdate),
            eventReferenceId: n.vsd_eventreferenceid,
            eventType: n.vsd_eventtype,
            id: n.vsd_guid,
          });
        });
        // this.client_details.notifications = res.value;
      }

      console.log(this.client_details);

    }, (err) => {
      console.log(err);
    });
  }
}
