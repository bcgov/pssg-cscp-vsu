import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CornetService, IClientParameters } from '../services/cornet.service';
import { FormBase } from '../shared/form-base';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent extends FormBase implements OnInit {
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

  constructor(private cornetService: CornetService,
    private fb: FormBuilder) {
    super();
  }
  ngOnInit() {
    this.form = this.fb.group({
      search_type: ["Exact"],
      surname: ["", Validators.required],
      given_name: [""],
      second_name: [""],
      current_name: [""],
      gender: [""],
      birthdate: [""],
      show_date_range: [""],
      year_range: [""],
      cs: [""],
      fps: [""],
    })
  }

  search() {
    // let type = "";
    // let text = ""
    // if (this.cs) {
    //   type = "CSNO";
    //   text = this.cs;
    // }
    // if (this.fps) {
    //   type = "FPS";
    //   text = this.fps;
    // }
    let parameters: IClientParameters = {
      search_type: this.form.get('search_type').value,
      surname: this.form.get('surname').value,
      // given1: this.given_name,
      // given2: this.second_name,
      // gender: this.gender,
      // birth_year: this.birthdate ? this.birthdate.getFullYear().toString() : "",
      // // birth_year_range
      // identifier_type: type,
      // identifier_text: text
    };

    // if (this.given_name) parameters.given1 = this.given_name;
    // if (this.second_name) parameters.given2 = this.second_name;
    // if (this.gender) parameters.gender = this.gender;
    // if (this.birthdate) parameters.birth_year = this.birthdate.getFullYear().toString();
    // if (type) parameters.identifier_type = type;
    // if (text) parameters.identifier_text = text;

    this.cornetService.getClients(parameters).subscribe((res) => {
      console.log(res);

    });
  }

}
