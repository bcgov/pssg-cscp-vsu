import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  previousUrl: string;
  public versionInfo: VersionInfo;
  public isNewUser: boolean;
  public isDevMode: boolean;

  constructor() {
  }

  isIE10orLower() {
    let result, jscriptVersion;
    result = false;

    jscriptVersion = new Function('/*@cc_on return @_jscript_version; @*/')();

    if (jscriptVersion !== undefined) {
      result = true;
    }
    return result;
  }

  // showVersionInfo(): void {
  //   this.dialog.open(VersionInfoDialog, {
  //     data: this.versionInfo
  //   });
  // }
}

class VersionInfo {
  baseUri: string;
  basePath: string;
  environment: string;
  sourceCommit: string;
  sourceRepository: string;
  sourceReference: string;
  fileCreationTime: string;
  fileVersion: string;
}
