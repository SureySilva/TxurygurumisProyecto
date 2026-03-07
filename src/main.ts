import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideFunctions, getFunctions } from '@angular/fire/functions';
// import { environment } from './environments/environment';
// import { routes } from './app/app.routes';
// import { provideRouter } from '@angular/router';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideFirebaseApp(() => initializeApp(environment.firebase)),
//     provideFunctions(() => getFunctions()),
//   ]
// });