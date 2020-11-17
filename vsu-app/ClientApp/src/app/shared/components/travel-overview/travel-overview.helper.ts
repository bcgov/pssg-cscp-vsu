import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

export class TravelOverviewInfoHelper {
    public setupFormGroup(fb: FormBuilder): FormGroup {
        let group = {
            criminalChargeOneOfOffences: ['', Validators.required],
            proceedingsImpactOutcome: ['', Validators.required],
            travelMoreThan100KM: ['', Validators.required],
            notCoveredByOtherSources: ['', Validators.required],
            additionalComments: [''],
        };

        return fb.group(group);
    }
}
