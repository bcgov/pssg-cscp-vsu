import { Component, Input } from "@angular/core";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-victim-contacts',
    templateUrl: './victim-contacts.component.html',
    styleUrls: ['./victim-contacts.component.scss'],
})
export class VictimContactsComponent {
    @Input() client_details: IClientDetails;
    constructor() { }
}