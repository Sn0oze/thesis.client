import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {VisualisationsModule} from './visualisations/visualisations.module';
import * as hammer from 'hammerjs';

class HammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: hammer.DIRECTION_ALL },
  } as any;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    VisualisationsModule,
    HammerModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
