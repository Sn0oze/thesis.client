import { Injectable } from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OptionsWheelComponent} from './options-wheel.component';

@Injectable({
  providedIn: 'root'
})
export class OptionsWheelService {
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {}

  open(event): void {
    const origin = event.center;
    // Returns an OverlayRef (which is a PortalHost)
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'invisible-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: this.overlay.position().flexibleConnectedTo(origin).withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'center',
        }
      ])
    });
    this.overlayRef.backdropClick().subscribe(e => this.close());

    // Create ComponentPortal that can be attached to a PortalHost
    const portal = new ComponentPortal(OptionsWheelComponent);

    // Attach ComponentPortal to PortalHost
    this.overlayRef.attach(portal);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}
