import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CornetService } from '../services/cornet.service';
import { NotificationService } from '../services/notification.service';
import { OffenderService } from '../services/offender.service';
import { EnumHelper } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import { IAuthorityDocument, IClientDetails, ICoastOffender, IHearing, IKeyDate, IMovement, IStateTransition, IVictimContact } from '../shared/interfaces/client-details.interface';
import { IClientParameters, ICornetParameters } from '../shared/interfaces/cornet-api-parameters.interface';

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

  coastOffenderDoesNotExist: boolean = false;

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

      authorityDocuments: [],
      hearings: [],
      keyDates: [],
      movements: [],
      notifications: [],
      stateTransitions: [],
      victimContacts: [],
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

    this.isLoading = true;

    this.loadOffenderFromCoast(clientNumber);
    this.loadOffenderFromCornet(clientNumber);
    this.loadNotifications(clientNumber);
  }

  loadOffenderFromCornet(clientNumber: string) {
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
        if (res.clients.length > 1) {
          let aliases = res.clients.filter(c => c.isCurrentName == "N");
          console.log("aliases");
          console.log(aliases.map(a => a.personName));
          // aliases.push({ personName: "Test, McTest" });
          this.client_details.aliases = aliases.map(a => a.personName).join(', ');
        }
        let curr_client = res.clients.find(c => c.isCurrentName == "Y");
        Object.assign(this.client_details, curr_client);
        this.client_details.lastName = this.client_details.personName.split(',')[0];
        this.client_details.givenNames = this.client_details.personName.split(',').splice(1).join(',');
      }
    }, (err) => {
      this.isLoading = false;
      alert("Error retrieving cornet info");
      console.log(err);
    });
  }

  loadNotifications(clientNumber: string) {
    this.notificationService.getNotificationsForClient(clientNumber).subscribe((res) => {
      if (res && res.value && res.value.length) {
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
            parameters.event_type = "authorityDocument";
            parameters.id_name = "authority_document_id";
            this.cornetService.getEvent(parameters).subscribe((res: IAuthorityDocument) => {
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
            parameters.event_type = "hearing";
            parameters.id_name = "hearing_id";
            this.cornetService.getEvent(parameters).subscribe((res: IHearing) => {
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
            parameters.event_type = "keyDate";
            parameters.id_name = "key_date_id";
            this.cornetService.getEvent(parameters).subscribe((res: IKeyDate) => {
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
            parameters.event_type = "movement";
            parameters.id_name = "movement_id";
            this.cornetService.getEvent(parameters).subscribe((res: IMovement) => {
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
            parameters.event_type = "stateTransition";
            parameters.id_name = "state_transition_id";
            this.cornetService.getEvent(parameters).subscribe((res: IStateTransition) => {
              if (res) {
                //cornet doesn't include the event date in it's results, but we can get that from the crm notification
                //so we combine it up
                let notification = this.client_details.notifications.find(n => n.eventReferenceId == res.activityId);
                if (notification) {
                  res.eventDate = notification.eventDate;
                }
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
            parameters.event_type = "victimContact";
            parameters.id_name = "individual_id";
            this.cornetService.getEvent(parameters).subscribe((res: IVictimContact) => {
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

      this.client_details.authorityDocuments.sort((a, b) => {
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      });

      this.client_details.authorityDocuments.forEach(auth => {
        auth.chargeCounts.sort((a, b) => {
          return (a.countSeqNo > b.countSeqNo) ? 1 : -1;
        });
      });

      // console.log(this.client_details);
    });

  }

  loadOffenderFromCoast(clientNumber: string) {
    this.offenderService.getOffenderByCSNumber(clientNumber).subscribe((res) => {
      console.log("coast offender");
      console.log(res);
      if (res && res.value && res.value.length == 1) {
        this.client_details.coastInfo = res.value[0];
      }
      else {
        this.coastOffenderDoesNotExist = true;
      }
    }, (err) => {
      console.log(err);
    });
  }

  createOffender() {
    let offender: ICoastOffender = {
      vsd_birthdate: new Date(this.client_details.personBirthDate),
      vsd_firstname: this.client_details.givenNames,
      vsd_lastname: this.client_details.lastName,
      vsd_csnumber: this.client_details.clientNumber,
      vsd_gender: this.enums.getOptionsSetValFromName(this.enums.Gender, this.client_details.personGenderIdentityCodeType).val
    }
    this.isLoading = true;
    this.offenderService.createOffender(offender).subscribe((res) => {
      console.log(res);
      console.log("offender created");
      this.coastOffenderDoesNotExist = false;
      this.loadOffenderFromCoast(this.client_details.clientNumber);
      this.loadNotifications(this.client_details.clientNumber);
      // this.isLoading = false;
    }, (err) => {
      console.log(err);
      this.isLoading = false;
    });;
  }

  setPage(page: PAGES) {
    this.currentPage = page;
  }
}
