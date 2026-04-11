import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { firebaseProviders } from './core/firebase/firebase.providers';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    ...firebaseProviders,
    provideHttpClient(),
    provideAuth(() => getAuth())
  ]
};
