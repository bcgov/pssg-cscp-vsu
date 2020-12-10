import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client.service';
import { CornetService } from '../services/cornet.service';
import { NotificationService } from '../services/notification.service';
import { EnumHelper } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import { IAuthorityDocument, IClientDetails, IHearing, IKeyDate, IMovement, IStateTransition, IVictimContact } from '../shared/interfaces/client-details.interface';
import { IClientParameters, ICornetParameters } from '../shared/interfaces/cornet-api-parameters.interface';

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

  enums: EnumHelper = new EnumHelper();

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private cornetService: CornetService,
  ) {
    super();
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') || "test";
    this.fullname = this.route.snapshot.paramMap.get('fullname') || "test";
    this.client = this.route.snapshot.paramMap.get('client') || "test";

    this.client_details = {
      clientNumber: "",
      isCurrentName: "",
      locationTypeCode: {
        community: "",
        custody: "",
      },
      personBirthDate: "",
      personGenderIdentityCodeType: "",
      personName: "",
    }

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
      if (res && res.clients) {
        Object.assign(this.client_details, res.clients[0]);
      }
    }, (err) => {
      console.log(err);
    });

    this.notificationService.getNotificationsForClient(clientNumber).subscribe((res) => {
      if (res && res.value && res.value.length) {
        this.client_details.notifications = [];
        this.client_details.authorityDocuments = [];
        this.client_details.hearings = [];
        this.client_details.keyDates = [];
        this.client_details.movements = [];
        this.client_details.stateTransitions = [];
        this.client_details.victimContacts = [];
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
        this.getClientNotifications();
      }
    }, (err) => {
      console.log(err);
    });
  }

  getClientNotifications() {
    console.log(this.client_details);

    for (let i = 0; i < this.client_details.notifications.length; i++) {
      let notification = this.client_details.notifications[i];
      let event_type = this.enums.getOptionsSetVal(this.enums.EventType, notification.eventType);

      let parameters: ICornetParameters = {
        event_id: notification.eventReferenceId,
        guid: notification.id,

        username: this.username,
        fullname: this.fullname,
        client: this.client,
      };

      switch (event_type) {
        case this.enums.EventType.AUTH_DOCM: {
          console.log("get auth doc");
          this.cornetService.getAuthorityDocument(parameters).subscribe((res: IAuthorityDocument) => {
            if (res) {
              this.client_details.authorityDocuments.push(res);
            }
          }, (err) => {
            console.log(err);
          });
          break;
        }
        case this.enums.EventType.HEARING: {
          console.log("get hearing");
          this.cornetService.getHearing(parameters).subscribe((res: IHearing) => {
            if (res) {
              this.client_details.hearings.push(res);
            }
          }, (err) => {
            console.log(err);
          });

          break;
        }
        case this.enums.EventType.KEY_DATE: {
          console.log("get key date");
          this.cornetService.getKeyDate(parameters).subscribe((res: IKeyDate) => {
            if (res) {
              this.client_details.keyDates.push(res);
            }
          }, (err) => {
            console.log(err);
          });
          break;
        }
        case this.enums.EventType.MOVEMENT: {
          console.log("get movement");
          this.cornetService.getMovement(parameters).subscribe((res: IMovement) => {
            if (res) {
              this.client_details.movements.push(res);
            }
          }, (err) => {
            console.log(err);
          });
          break;
        }
        case this.enums.EventType.STATE_TRAN: {
          console.log("get state transition");
          this.cornetService.getStateTransition(parameters).subscribe((res: IStateTransition) => {
            if (res) {
              this.client_details.stateTransitions.push(res);
            }
          }, (err) => {
            console.log(err);
          });
          break;
        }
        case this.enums.EventType.VICT_CNTCT: {
          console.log("get victim contact");

          this.cornetService.getVictimContact(parameters).subscribe((res: IVictimContact) => {
            if (res) {
              this.client_details.victimContacts.push(res);
            }
          }, (err) => {
            console.log(err);
          });
          break;
        }
      }
    }

  }
}
