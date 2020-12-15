import { Component, Input } from "@angular/core";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-state-transitions',
    templateUrl: './state-transitions.component.html',
    styleUrls: ['./state-transitions.component.scss'],
})
export class StateTransitionsComponent {
    @Input() client_details: IClientDetails;
    constructor() { }
}