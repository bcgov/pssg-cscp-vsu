import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CornetService } from '../services/cornet.service';
import { NotificationService } from '../services/notification.service';
import { OffenderService } from '../services/offender.service';
import { EnumHelper } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import { IAuthorityDocument, IClientDetails, IHearing, IKeyDate, IMovement, IStateTransition, IVictimContact } from '../shared/interfaces/client-details.interface';
import { IClientParameters, ICornetParameters } from '../shared/interfaces/cornet-api-parameters.interface';

// const PAGES: string[] = ["subjectInformation", "movements", "offences", "hearings", "victimInformation", "stateTransitions"];

enum PAGES {
  SubjectInformation,
  Movements,
  Offences,
  Hearings,
  VictimInformation,
  StateTransitions
};


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

  currentPage: PAGES = PAGES.SubjectInformation;

  PAGES = PAGES;


  constructor(public fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private cornetService: CornetService,
    private offenderService: OffenderService,
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

    this.isLoading = true;

    this.offenderService.getOffenderByCSNumber(clientNumber).subscribe((res) => {
      console.log("coast offender");
      console.log(res);
      if (res && res.value && res.value.length == 1) {
        this.client_details.coastInfo = res.value[0];
      }
    }, (err) => {
      console.log(err);
    });

    this.cornetService.getClients(parameters).subscribe((res) => {
      if (res && res.clients) {
        Object.assign(this.client_details, res.clients[0]);
        this.client_details.lastName = this.client_details.personName.split(',')[0];
        this.client_details.givenNames = this.client_details.personName.split(',').splice(1).join(',');
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
      else {
        this.isLoading = false;
        console.log("no notifications to load");
        console.log(this.client_details);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getClientNotifications() {
    let promise_array = [];
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
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getAuthorityDocument(parameters).subscribe((res: IAuthorityDocument) => {
              if (res) {
                this.client_details.authorityDocuments.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
        case this.enums.EventType.HEARING: {
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getHearing(parameters).subscribe((res: IHearing) => {
              if (res) {
                this.client_details.hearings.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
        case this.enums.EventType.KEY_DATE: {
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getKeyDate(parameters).subscribe((res: IKeyDate) => {
              if (res) {
                this.client_details.keyDates.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
        case this.enums.EventType.MOVEMENT: {
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getMovement(parameters).subscribe((res: IMovement) => {
              if (res) {
                if (res.activityDate.actual != null) res.activityDate.val = res.activityDate.actual;
                else if (res.activityDate.scheduled != null) res.activityDate.val = res.activityDate.scheduled;
                this.client_details.movements.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
        case this.enums.EventType.STATE_TRAN: {
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getStateTransition(parameters).subscribe((res: IStateTransition) => {
              if (res) {
                this.client_details.stateTransitions.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
        case this.enums.EventType.VICT_CNTCT: {
          promise_array.push(new Promise<void>((resolve, reject) => {
            this.cornetService.getVictimContact(parameters).subscribe((res: IVictimContact) => {
              if (res) {
                this.client_details.victimContacts.push(res);
              }
              resolve();
            }, (err) => {
              reject();
              console.log(err);
            });
          }));
          break;
        }
      }
    }

    Promise.all(promise_array).then(() => {
      this.isLoading = false;

      this.client_details.keyDates.sort((a, b) => {
        return new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime();
      });

      this.client_details.movements.sort((a, b) => {
        return new Date(b.activityDate.actual).getTime() - new Date(a.activityDate.actual).getTime();
      });

      // console.log(this.client_details);
    });

  }

  setPage(page: PAGES) {
    this.currentPage = page;
  }
}
