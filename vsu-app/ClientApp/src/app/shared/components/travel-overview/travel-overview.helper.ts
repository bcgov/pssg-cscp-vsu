import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ApplicationType } from "../../enums-list";

export class TravelOverviewInfoHelper {
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {
            offences: fb.array([]),
            proceedingsImpactOutcome: ['', Validators.required],
            proceedingsImpactOutcomeComment: [''],
            travelMoreThan100KM: ['', Validators.required],
            travelMoreThan100KMComment: [''],
            notCoveredByOtherSources: ['', Validators.required],
            notCoveredByOtherSourcesComment: [''],
            additionalComments: [''],
        };

        return fb.group(group);
    }
}
