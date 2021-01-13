import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffenderService } from '../services/offender.service';
import { ICoastOffender } from '../shared/interfaces/client-details.interface';

@Component({
    selector: 'app-home',
    templateUrl: './cornet-info.component.html',
})
export class CornetInfoLoadingHandler implements OnInit {
    isLocalHost: boolean = false;
    isIE: boolean = false;
    showError: boolean = false;
    coastInfo: ICoastOffender;
    isLoading: boolean = true;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private offenderService: OffenderService,
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            console.log('params');
            console.log(params);
            if (params && params.id && params.typename && params.typename == "vsd_offender") {
                this.getClientDetails(params.id);
            }
            else {
                console.log("missing required query params, rerouting to client search page");
                this.router.navigate([`client-search`]);
            }
        });

        if (window.location.origin === "http://localhost:5000" || window.location.origin === "https://localhost:5001") {
            this.isLocalHost = true;
        }
        else {
            //add some redirect for default landing spot...
        }
    }

    getClientDetails(vsd_offenderid) {
        this.offenderService.getOffenderById(vsd_offenderid).subscribe((res) => {
            console.log("coast offender");
            console.log(res);
            this.isLoading = false;
            if (res && res.value && res.value.length == 1) {
                this.coastInfo = res.value[0];

                if (this.coastInfo.vsd_csnumber) {
                    console.log("go to client details");
                    this.router.navigate([`client-details/${this.coastInfo.vsd_csnumber}`]);
                }
                else {
                    console.log("go to client search");
                    this.router.navigate([`client-search`], { queryParams: { dosearch: true, surname: this.coastInfo.vsd_lastname, givenName: this.coastInfo.vsd_firstname, gender: this.coastInfo.vsd_gender, birthyear: this.coastInfo.vsd_birthdate ? this.coastInfo.vsd_birthdate.slice(0, 4) : null } });
                    // this.router.navigate([`client-search?dosearch=true&surname=${this.coastInfo.vsd_lastname}&givenName=${this.coastInfo.vsd_firstname}&gender=${this.coastInfo.vsd_gender}&birthdate=${this.coastInfo.vsd_birthdate}`]);
                }
            }
            else {
                this.showError = true;
            }

        }, (err) => {
            console.log(err);
        });
    }
}
