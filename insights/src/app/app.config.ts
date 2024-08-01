import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  isDevMode,
  APP_INITIALIZER
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { AppContext } from './app.context';
import { MatIconRegistry } from '@angular/material/icon';

const formFieldOptions: MatFormFieldDefaultOptions = {appearance: 'outline'}

export function fontSetInitializer(registry: MatIconRegistry): () => void {
  return () => registry.setDefaultFontSetClass('material-symbols-rounded')
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: fontSetInitializer,
      multi: true,
      deps: [MatIconRegistry],
    },
    AppContext,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions}
  ]
};
