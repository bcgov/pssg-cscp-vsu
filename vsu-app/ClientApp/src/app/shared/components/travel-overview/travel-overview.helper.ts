import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class TravelOverviewInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
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
