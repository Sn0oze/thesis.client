import {Injectable, Injector} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {OptionsWheelComponent} from './options-wheel.component';
import {WHEEL_CONFIG_DATA, WheelConfig} from './models';

@Injectable({
  providedIn: 'root'
})
export class OptionsWheelService {
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {
  }

  open(event, config?: WheelConfig): void {
    this.close();
    const origin = event.center;
    // Returns an OverlayRef (which is a PortalHost)
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      backdropClass: 'invisible-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().flexibleConnectedTo(origin).withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'center',
        }
      ])
    });
    // this.overlayRef.backdropClick().subscribe(e => this.close());
    // Create ComponentPortal that can be attached to a PortalHost
    const wheelConfig = {annotate: true, filter: true, trim: true, categorize: true, view: true} as WheelConfig;
    if (config) {
      Object.keys(config).forEach(property => wheelConfig[property] = config[property]);
    }
    const portal = new ComponentPortal(OptionsWheelComponent, null, this.configInjector(
      wheelConfig
    ));
    // Attach ComponentPortal to PortalHost
    this.overlayRef.attach(portal);
  }

  configInjector(dataToPass): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(WHEEL_CONFIG_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
