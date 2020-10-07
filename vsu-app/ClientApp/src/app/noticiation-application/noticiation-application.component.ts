import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper, MatVerticalStepper } from '@angular/material';
import { FormBase } from '../shared/form-base';

@Component({
    selector: 'app-notification-application',
    templateUrl: './noticiation-application.component.html',
    styleUrls: ['./noticiation-application.component.scss']
})
export class NotificationApplicationComponent extends FormBase implements OnInit {
    @ViewChild('stepper', { static: true }) applicationStepper: MatVerticalStepper;
    isIE: boolean = false;
    showValidationMessage: boolean;
    submitting: boolean = false;
    public currentFormStep: number = 0;
    public showPrintView: boolean = false;

    elements: string[] = ['overview', 'caseInformation', 'applicantInformation', 'recipientInformation', 'authorizationInformation']

    constructor(private fb: FormBuilder,) {
        super();
    }

    ngOnInit() {
        var ua = window.navigator.userAgent;
        this.isIE = /MSIE|Trident/.test(ua);
        this.form = this.buildApplicationForm();
    }

    buildApplicationForm(): FormGroup {
        let group = {
            overview: this.fb.group({
            }),
            caseInformation: this.fb.group({
            }),
            applicantInformation: this.fb.group({
            }),
            recipientInformation: this.fb.group({
            }),
            authorizationInformation: this.fb.group({
            }),
        };

        return this.fb.group(group);
    }

    gotoPage(selectPage: MatStepper): void {
        // When a user clicks on the stepper this is triggered
        window.scroll(0, 0);
        this.showValidationMessage = false;
        this.currentFormStep = selectPage.selectedIndex;
    }

    gotoNextStep(stepper: MatStepper, emptyPage?: boolean): void {
        // when a user clicks the continue button we move them to the next part of the form
        if (stepper) {
            // the stepper indexes match our form indexes
            const desiredFormIndex: number = stepper.selectedIndex;
            // get the text value of the form index
            const formGroupName = this.elements[desiredFormIndex];
            console.log(`Form for validation is ${formGroupName}.`);
            // be sure that the stepper is in range
            if (desiredFormIndex >= 0 && desiredFormIndex < this.elements.length) {
                // collect the matching form group from the form
                const formParts = this.form.get(formGroupName);
                // TODO: how do we know this is true?
                let formValid = true;

                // if there is a form returned with the name
                if (formParts != null) {
                    // collect the validity of it
                    formValid = formParts.valid;
                    console.log(formParts);
                } else {
                    alert('That was a null form. Nothing to validate')
                }

                // Ensure if the page is empty that the form is valid
                if (emptyPage != null) {
                    if (emptyPage == true) {
                        formValid = true;
                        //formParts.valid = true;
                    }
                }

                if (formValid) {
                    console.log('Form is valid so proceeding to next step.')
                    this.showValidationMessage = false;
                    window.scroll(0, 0);
                    stepper.next();
                } else {
                    console.log('Form is not valid rerun the validation and show the validation message.')
                    this.validateAllFormFields(formParts);
                    this.showValidationMessage = true;
                }
            }
        }
    }

    gotoPreviousStep(stepper: MatStepper): void {
        if (stepper) {
            console.log('Going back a step');
            this.showValidationMessage = false;
            window.scroll(0, 0);
            stepper.previous();
        }
    }
}
