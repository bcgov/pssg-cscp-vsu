import { Component, Input } from "@angular/core";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-movements',
    templateUrl: './movements.component.html',
    styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent {
    @Input() client_details: IClientDetails;
    constructor() { }
}