import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ApplicationType } from '../../enums-list';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
    @Input() formType: any;
    @Input() confirmationNumber: string;
    @Output() showPrintView: EventEmitter<boolean> = new EventEmitter<boolean>();

    formName: string;
    confirmationMessage: string = "";

    constructor() { }

    ngOnInit() {
        if (this.formType.val === ApplicationType.NOTIFICATION) {
            this.confirmationMessage = "Thank you for for submitting a Victim Safety Unit Notification Application. Please write down the following number for future reference:"
        }
        else if (this.formType.val === ApplicationType.TRAVEL_FUNDS) {
            this.confirmationMessage = "Thank you for for submitting a Victim Travel Fund Application to the Victim Safety Unit. Please write down the following number for future reference:"
        }
    }

    print() {
        window.scroll(0, 0);
        this.showPrintView.emit(true);
        setTimeout(() => {
            window.print();
        }, 100);
    }

    @HostListener('window:afterprint')
    onafterprint() {
        window.scroll(0, 0);
        this.showPrintView.emit(false);
    }

    returnToVSUHome() {
        window.location.href = "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/bcs-criminal-justice-system/if-you-are-a-victim-of-a-crime/victim-of-crime/victim-notification";
    }
}
