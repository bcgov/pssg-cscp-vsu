import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../services/client.service';
import { NotificationService } from '../services/notification.service';
import { NgbdSortableHeader, SortEvent } from '../shared/directives/sortable.directive';
import { EnumHelper, IOptionSetVal } from '../shared/enums-list';
import { FormBase } from '../shared/form-base';
import { IClient } from '../shared/interfaces/client-search.interface';
import { IClientParameters } from '../shared/interfaces/cornet-api-parameters.interface';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent extends FormBase implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  years: string[] = [];
  didLoad: boolean = false;

  clients: IClient[] = [];
  clients$: Observable<IClient[]>;
  total$: Observable<number>;

  username: string = "";
  fullname: string = "";
  client: string = "";

  showSearchFields: boolean = true;

  enums = new EnumHelper();

  constructor(private fb: FormBuilder,
    public clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    super();
    this.clients$ = clientService.clients$;
    this.total$ = clientService.total$;
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') || "test";
    this.fullname = this.route.snapshot.paramMap.get('fullname') || "test";
    this.client = this.route.snapshot.paramMap.get('client') || "test";



    this.form = this.fb.group({
      search_type: ["Exact"],
      surname: ["", Validators.required],
      given_name: [""],
      second_name: [""],
      current_name: [""],
      gender: [""],
      birth_year: [""],
      show_date_range: [""],
      year_range: [""],
      cs: [""],
      fps: [""],
    });

    this.route.queryParams.subscribe(params => {
      console.log(params);
      let dosearch = params.dosearch || false;

      if (dosearch) {
        let surname = params.surname || false;
        let given = params.givenName || false;
        let genderString = params.gender || "";
        let birthyear = params.birthyear || false;

        if (surname) {
          this.form.get('surname').patchValue(surname);
        }
        if (given) {
          this.form.get('given_name').patchValue(given);
        }
        if (genderString) {
          this.form.get('gender').patchValue(this.enums.getOptionsSetVal(this.enums.Gender, parseInt(genderString)).name);
        }
        if (birthyear) {
          this.form.get('birth_year').patchValue(birthyear);
        }
        this.search();
        this.showSearchFields = false;

      }

    });

    let this_year = new Date().getFullYear();

    for (let i = 1900; i < this_year; i++) {
      this.years.push(i.toString());
    }
  }

  searchTypeChange(type: IOptionSetVal) {
    if (type === this.enums.SearchType.EXACT) {
      this.form.get('given_name').enable();
      this.form.get('second_name').enable();
      this.form.get('current_name').enable();
      this.form.get('gender').enable();
      this.form.get('birth_year').enable();
      this.form.get('year_range').enable();
    }
    else if (type === this.enums.SearchType.PARTIAL || type === this.enums.SearchType.SOUNDEX) {
      this.form.get('given_name').patchValue('');
      this.form.get('second_name').patchValue('');
      this.form.get('current_name').patchValue('');
      this.form.get('gender').patchValue('');
      this.form.get('birth_year').patchValue('');
      this.form.get('year_range').patchValue('');

      this.form.get('given_name').disable();
      this.form.get('second_name').disable();
      this.form.get('current_name').disable();
      this.form.get('gender').disable();
      this.form.get('birth_year').disable();
      this.form.get('year_range').disable();
      // this.form.get('cs').patchValue('');
      // this.form.get('fps').patchValue('');
    }
  }

  surnameChange(val) {
    if (val) {
      this.form.get('fps').patchValue('');
      this.form.get('cs').patchValue('');
    }
  }

  fieldChange(val) {
    if (val) {
      this.form.get('fps').patchValue('');
      this.form.get('cs').patchValue('');
    }
  }

  csChange(val) {
    if (val) {
      this.clearControlValidators(this.form.get('surname'));
      this.form.get('surname').patchValue('');
      this.form.get('given_name').patchValue('');
      this.form.get('second_name').patchValue('');
      this.form.get('current_name').patchValue('');
      this.form.get('gender').patchValue('');
      this.form.get('birth_year').patchValue('');
      this.form.get('year_range').patchValue('');
      this.form.get('fps').patchValue('');
    }
    else {
      this.setControlValidators(this.form.get('surname'), Validators.required);
    }
  }

  fpsChange(val) {
    if (val) {
      this.clearControlValidators(this.form.get('surname'));
      this.form.get('surname').patchValue('');
      this.form.get('given_name').patchValue('');
      this.form.get('second_name').patchValue('');
      this.form.get('current_name').patchValue('');
      this.form.get('gender').patchValue('');
      this.form.get('birth_year').patchValue('');
      this.form.get('year_range').patchValue('');
      this.form.get('cs').patchValue('');
    }
    else {
      this.setControlValidators(this.form.get('surname'), Validators.required);
    }
  }

  search() {
    let parameters: IClientParameters = {
      search_type: this.form.get('search_type').value,
      surname: this.form.get('surname').value,
      given1: this.form.get('given_name').value,
      given2: this.form.get('second_name').value,
      gender: this.form.get('gender').value,
      birth_year: this.form.get('birth_year').value,
      birth_year_range: this.form.get('year_range').value,

      username: this.username,
      fullname: this.fullname,
      client: this.client,
    };

    let type = "";
    let text = ""
    if (this.form.get('cs').value) {
      type = "CSNO";
      text = this.form.get('cs').value;
      parameters.search_type = "ID";
    }
    if (this.form.get('fps').value) {
      type = "FPS";
      text = this.form.get('fps').value;
      parameters.search_type = "ID";
    }

    if (type) parameters.identifier_type = type;
    if (text) parameters.identifier_text = text;

    this.clientService.updateClients(parameters).then((res) => {
      this.didLoad = true;
    });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.clientService.sortColumn = column;
    this.clientService.sortDirection = direction;
  }

  setPageSize(val) {
    this.clientService.pageSize = parseInt(val);
  }

  currentNameChange(val) {
    this.clientService.page = 1;
    this.clientService.currentName = val;
  }

  showOffender(clientNumber: string) {
    this.router.navigate([`client-details/${clientNumber}`]);

  }

}
