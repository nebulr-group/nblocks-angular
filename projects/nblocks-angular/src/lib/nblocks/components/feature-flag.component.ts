import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlagsService } from '../services/flags.service';

@Component({
  selector: 'app-feature-flag',
  template: `
    <ng-container #container></ng-container>
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class FeatureFlagComponent implements OnInit, OnDestroy {
  @Input() flagKey!: string;
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) content!: TemplateRef<any>;

  private subscription: Subscription | undefined;

  constructor(private flagsService: FlagsService) {}

  ngOnInit() {
    this.subscription = this.flagsService.flagsStorage$.subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateView() {
    this.container.clear();
    if (this.flagsService.flagEnabled(this.flagKey)) {
      this.container.createEmbeddedView(this.content);
    }
  }
}
