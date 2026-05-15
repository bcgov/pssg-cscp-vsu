# vsu-cornet

## Local Development

### Pre-reqs

- Node 12.x
- npm 6.x

#### For those using [NVM](https://github.com/nvm-sh/nvm)

```bash
nvm install 12.22.12
nvm use 12.22.12
```

## Running the application locally

### NPM Install

From the `vsu-cornet/ClientApp` folder

```
npm install
```

### DotNet Secrets

[Setup secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=windows#secret-manager)

#### Secrets Template

```JSON
{
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
      "DynamicsApiEndpointUrl": "https://cscp-dev.api.crm3.dynamics.com/api/data/v9.2/",,
      "TenantId": "<cloud_tenant_id>",
      "ClientId": "<cloud_client_id>",
      "ClientSecret": "<cloud_client_secret>",
      "ResourceName": "https://cscp-dev.api.crm3.dynamics.com"
    }
  }
}
```

### Start the app

This app currently runs as a Single Page Application (SPA). So running the DotNet backend will also run and deploy the Angular frontend.

From the `vsu-cornet` folder.

```bash
dotnet run
```

The application should now be available at `localhost:5000`.

## Deployed URLs

### Dev

??

### Test

??

### Prod

??
````
