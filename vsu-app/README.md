# vsu-app

## Local Development

### Pre-reqs

- Node.js 22.x or later
- npm 10.x or later

#### For those using [NVM](https://github.com/nvm-sh/nvm)

```bash
nvm install 22.18.0
nvm use 22.18.0
```

## Running the application locally

### NPM Install

From the `vsu-app/ClientApp` folder

```
npm install
```

#### Angular Upgrade Notes

- The frontend has been upgraded to Angular 16+.
- Angular Material imports and usage have been updated for compatibility.
- Input masking uses `ngx-mask` v17+ with `provideNgxMask()` in `app.module.ts`.
- Digital signature functionality now uses `@almothafar/angular-signature-pad` (replacing `angular2-signaturepad`).

### DotNet Secrets

[Setup secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=windows#secret-manager)

#### Secrets Template

```JSON
{
  "BASE_PATH": "/vsuwebforms",

  "FEATURE_USE_UPDATED_COMPLIANCE_FIELDS": true,

  "CONFIGURATION_OUTAGEINFORMATION_MESSAGE": "",
  "CONFIGURATION_OUTAGEINFORMATION_STARTDATE": "",
  "CONFIGURATION_OUTAGEINFORMATION_ENDDATE": "",

  "CONTACT_EMAIL": "",

  "Dynamics": {
    "AuthenticationType": "OnPremise",
    "ADFS": {
      "DynamicsApiEndpointUrl": "http://dev-coast-dataverse-proxy.silver.devops.bcgov/api/data/v9.0/",
      "OAuth2TokenEndpoint": "https://ststest.gov.bc.ca/adfs/oauth2/token",
      "ClientId": "<onpremise_client_id>",
      "ClientSecret": "<onpremise_client_secret>",
      "ServiceAccountName": "<onpremise_service_account_username>",
      "ServiceAccountPassword": "<onpremise_service_account_password>",
      "ResourceName": "https://cscp-vs.dev.jag.gov.bc.ca/api/data/v9.0/"
    },
    "EntraId": {
      "DynamicsApiEndpointUrl": "https://csvs-coast-dev.api.crm3.dynamics.com/api/data/v9.2/",,
      "TenantId": "<cloud_tenant_id>",
      "ClientId": "<cloud_client_id>",
      "ClientSecret": "<cloud_client_secret>",
      "ResourceName": "https://csvs-coast-dev.crm3.dynamics.com"
    }
  }
}
```

### Start the app

This app runs as a Single Page Application (SPA). Running the DotNet backend will also build and serve the Angular frontend.

From the `vsu-app` folder:

```bash
dotnet run
```

The application should now be available at `http://localhost:5000`.

## Deployed URLs

### Dev

https://dev.justice.gov.bc.ca/vsuwebforms/notification_application

### Test

https://test.justice.gov.bc.ca/vsuwebforms/notification_application

### Prod

https://justice.gov.bc.ca/vsuwebforms/notification_application
