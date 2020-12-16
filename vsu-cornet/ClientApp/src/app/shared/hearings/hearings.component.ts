import { Component, Input } from "@angular/core";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-hearings',
    templateUrl: './hearings.component.html',
    styleUrls: ['./hearings.component.scss'],
})
export class HearingsComponent {
    @Input() client_details: IClientDetails;
    constructor() { }
}