# vsu-app

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

From the `vsu-app/ClientApp` folder

```
npm install
```

### DotNet Secrets

[Setup secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=windows#secret-manager)

### Start the app

This app currently runs as a Single Page Application (SPA). So running the DotNet backend will also run and deploy the Angular frontend.

From the `vsu-app` folder.

```bash
dotnet run
```

The application should now be available at `localhost:5000`.

## Deployed URLs

### Dev

https://dev.justice.gov.bc.ca/vsuwebforms/notification_application

### Test

https://test.justice.gov.bc.ca/vsuwebforms/notification_application

### Prod

https://justice.gov.bc.ca/vsuwebforms/notification_application
