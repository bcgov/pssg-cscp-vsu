import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApplicationType, EnumHelper } from "../../enums-list";
import { POSTAL_CODE } from "../../regex.constants";

export class TravelExpensesHelper {
    enum = new EnumHelper();
    postalRegex = POSTAL_CODE;
    public setupFormGroup(fb: FormBuilder, form_type: ApplicationType): FormGroup {
        let group = {


            additionalComments: [''],
        }
        return fb.group(group);
    }
}