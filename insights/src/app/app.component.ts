import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {SettingsService} from './shared/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'insights';
  constructor(
    private settings: SettingsService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'content-copy',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/content_copy.svg'));
  }
  toggleBars(): void {
    this.settings.toggle();
  }
}

