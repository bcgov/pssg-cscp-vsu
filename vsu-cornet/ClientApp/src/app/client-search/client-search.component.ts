import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClientService } from '../services/client.service';
import { CornetService } from '../services/cornet.service';
import { NgbdSortableHeader, SortEvent } from '../shared/directives/sortable.directive';
import { FormBase } from '../shared/form-base';
import { IClient, IClientParameters } from '../shared/interfaces/client-search.interface';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent extends FormBase implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  // search_type: string = "Exact";
  // surname: string = "";
  // given_name: string = "";
  // second_name: string = "";
  // current_name: boolean = false;
  // gender: string = "";
  // birthdate: Date = null;
  // show_date_range: boolean = false;
  // year_range: number = 0;
  // cs: string = "";
  // fps: string = "";
  years: string[] = [];

  clients: IClient[] = [];
  clients$: Observable<IClient[]>;
  total$: Observable<number>;

  constructor(private cornetService: CornetService,
    private fb: FormBuilder,
    public clientService: ClientService,
  ) {
    // this.clients = clientService.clients$;
    super();
    this.clients$ = clientService.clients$;
    this.total$ = clientService.total$;
  }
  ngOnInit() {
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

  search() {
    let type = "";
    let text = ""
    if (this.form.get('cs').value) {
      type = "CSNO";
      text = this.form.get('cs').value;
    }
    if (this.form.get('fps').value) {
      type = "FPS";
      text = this.form.get('fps').value;
    }
    let parameters: IClientParameters = {
      search_type: this.form.get('search_type').value,
      surname: this.form.get('surname').value,
      given1: this.form.get('given_name').value,
      given2: this.form.get('second_name').value,
      gender: this.form.get('gender').value,
      birth_year: this.form.get('birth_year').value,
      // // birth_year_range
      // identifier_type: this.form.get('surname').value,
      // identifier_text: this.form.get('surname').value,
    };

    // if (this.given_name) parameters.given1 = this.given_name;
    // if (this.second_name) parameters.given2 = this.second_name;
    // if (this.gender) parameters.gender = this.gender;
    // if (this.birthdate) parameters.birth_year = this.birthdate.getFullYear().toString();
    if (type) parameters.identifier_type = type;
    if (text) parameters.identifier_text = text;

    this.clientService.updateClients(parameters);

    // this.cornetService.getClients(parameters).subscribe((res) => {
    //   console.log(res);
    //   if (res.clients) {

    //     this.clients = res.clients;
    //   }

    // }, (err) => {
    //   console.log("ERROR GETTING CLIENTS");
    //   console.log(err);
    // });
  }

  onSort({ column, direction }: SortEvent) {
    console.log("sort");
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.clientService.sortColumn = column;
    this.clientService.sortDirection = direction;
  }

}
