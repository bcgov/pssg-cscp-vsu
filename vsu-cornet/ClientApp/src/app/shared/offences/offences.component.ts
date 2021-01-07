import { Component, Input } from "@angular/core";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-offences',
    templateUrl: './offences.component.html',
    styleUrls: ['./offences.component.scss'],
})
export class OffencesComponent {
    @Input() client_details: IClientDetails;
    constructor() { }
}