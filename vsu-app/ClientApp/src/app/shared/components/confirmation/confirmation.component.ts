import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
    @Input() formType: any;
    @Input() confirmationNumber: string;
    @Output() showPrintView: EventEmitter<boolean> = new EventEmitter<boolean>();

    formName: string;
    constructor() { }

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

    close() {
        window.close();
    }
}
