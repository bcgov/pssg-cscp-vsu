import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: 'app-additional-info-banner',
    templateUrl: './additional-info-banner.component.html',
    styleUrls: ['./additional-info-banner.component.scss']
})
export class AdditionalInfoBannerComponent {
    @Output() downloadPDFClick: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    downloadPDF() {
        this.downloadPDFClick.emit(true);
    }
}