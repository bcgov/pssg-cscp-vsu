import { Component, Input } from "@angular/core";
import { CRMBoolean } from "../enums-list";
import { IClientDetails } from "../interfaces/client-details.interface";

@Component({
    selector: 'app-subject-information',
    templateUrl: './subject-information.component.html',
    styleUrls: ['./subject-information.component.scss'],
})
export class SubjectInformationComponent {
    @Input() client_details: IClientDetails;
    CRMBoolean = CRMBoolean
    constructor() { }
}