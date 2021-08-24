import { Component, Input, OnInit } from "@angular/core";
import { LookupService } from "../../../services/lookup.service";
import { ApplicationType } from "../../enums-list";

@Component({
    selector: 'app-additional-info-banner',
    templateUrl: './additional-info-banner.component.html',
    styleUrls: ['./additional-info-banner.component.scss']
})
export class AdditionalInfoBannerComponent implements OnInit {
    @Input() formType: ApplicationType;
    pdfLink: string = "";
    window = window;
    contactEmail = "";
    constructor(private lookupService: LookupService) {
    }

    ngOnInit() {
        console.log("init");
        if (this.formType === ApplicationType.NOTIFICATION) {
            this.pdfLink = "https://www2.gov.bc.ca/assets/gov/law-crime-and-justice/criminal-justice/bc-criminal-justice-system/if-victim/publications/vsu-application-victim-notification.pdf";
        }
        else if (this.formType === ApplicationType.TRAVEL_FUNDS) {
            this.pdfLink = "";
        }
        this.lookupService.getContactEmail().subscribe((res) => {
            if (res && res.contactEmail) {
                this.contactEmail = res.contactEmail;
            }
        }, (err) => {
            console.log(err);
        });
    }
}