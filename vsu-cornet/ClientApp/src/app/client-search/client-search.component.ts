import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../services/client.service';
import { CornetService } from '../services/cornet.service';
import { NotificationService } from '../services/notification.service';
import { NgbdSortableHeader, SortEvent } from '../shared/directives/sortable.directive';
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

  clients: IClient[] = [];
  clients$: Observable<IClient[]>;
  total$: Observable<number>;

  username: string = "";
  fullname: string = "";
  client: string = "";

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

    let this_year = new Date().getFullYear();

    for (let i = 1900; i < this_year; i++) {
      this.years.push(i.toString());
    }
  }

  surnameChange(val) {
    if (val) {
      this.form.get('fps').patchValue('');
      this.form.get('cs').patchValue('');
    }
  }

  csChange(val) {
    if (val) {
      this.clearControlValidators(this.form.get('surname'));
      this.form.get('fps').patchValue('');
    }
    else {
      this.setControlValidators(this.form.get('surname'), Validators.required);
    }
  }

  fpsChange(val) {
    if (val) {
      this.clearControlValidators(this.form.get('surname'));
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

    this.clientService.updateClients(parameters);
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
