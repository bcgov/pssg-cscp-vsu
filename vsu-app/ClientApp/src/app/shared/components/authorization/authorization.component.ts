import { Component, Input, OnInit } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog, MatDialogConfig } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { FormGroup, ControlContainer } from "@angular/forms";
import { ApplicationType, MY_FORMATS } from "../../enums-list";
import { FormBase } from "../../form-base";
import { SignPadDialog } from "../../dialogs/sign-dialog/sign-dialog.component";
import { AuthInfoHelper } from './authorization.helper';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AuthorizationComponent extends FormBase implements OnInit {
    @Input() formType: ApplicationType;
    @Input() isDisabled: boolean;
    public form: FormGroup;

    authInfoHelper = new AuthInfoHelper();

    ApplicationType = ApplicationType;

    constructor(
        private controlContainer: ControlContainer,
        private matDialog: MatDialog,
    ) {
        super();
    }

    ngOnInit() {
        this.form = <FormGroup>this.controlContainer.control;
        setTimeout(() => { this.form.markAsTouched(); }, 0);
        console.log("auth info component");
        console.log(this.form);

        if (this.formType === ApplicationType.TRAVEL_REIMBURSEMENT) {
            let subTotal = this.form.parent.get('travelExpenses.subTotal').value || 0;
            this.form.get('subTotal').patchValue(subTotal);
            this.updateTotalClaim();
        }
    }

    showSignPad(control): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        const dialogRef = this.matDialog.open(SignPadDialog, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
                var patchObject = {};
                patchObject[control] = data;
                this.form.patchValue(
                    patchObject
                );
            },
            err => console.log(err)
        );
    }

    updateTotalClaim() {
        let subTotal = this.form.get('subTotal').value || 0;
        let advanceTotal = this.form.get('travelAdvanceAlreadyPaid').value || 0;

        let total = parseFloat(subTotal) - parseFloat(advanceTotal);
        if (total < 0) {
            this.form.get('travelAdvanceAlreadyPaid').patchValue(subTotal)
            total = 0;
        }
        this.form.get('totalReimbursementClaim').patchValue((Math.round(total * 100 + Number.EPSILON) / 100).toFixed(2));
    }
}
