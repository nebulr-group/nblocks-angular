import { Directive, Inject, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagService } from '../services/feature-flag.service';
import { NBLOCKS_FEATURE_FLAG_SERVICE } from '../tokens/nblocks-tokens';

@Directive({
  selector: '[nblocksFeatureFlag]',
  standalone: true
})
export class FeatureFlagDirective {
  private hasView = false;
  private flagName: string = '';
  private negate = false;
  private live = false;
  private service: FeatureFlagService;
  private elseTemplateRef: TemplateRef<any> | null = null;

  @Input('nblocksFeatureFlag')
  set feature(flagName: string) {
    this.flagName = flagName;
    this.updateView();
  }

  @Input('nblocksFeatureFlagNegate')
  set negateFlag(value: boolean) {
    this.negate = value;
    this.updateView();
  }

  @Input('nblocksFeatureFlagLive')
  set isLive(value: boolean) {
    this.live = value;
    this.updateView();
  }

  @Input('nblocksFeatureFlagElse')
  set elseTemplate(templateRef: TemplateRef<any> | null) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  constructor(
    @Optional() @Inject(NBLOCKS_FEATURE_FLAG_SERVICE) tokenService: FeatureFlagService | null,
    @Optional() standardService: FeatureFlagService | null,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    // Use token service if provided, otherwise fall back to standard DI
    this.service = tokenService || standardService || this.throwError();
  }

  private throwError(): never {
    throw new Error('FeatureFlagService must be provided either through standard DI or through NBLOCKS_FEATURE_FLAG_SERVICE token');
  }

  private async updateView(): Promise<void> {
    if (!this.flagName) return;

    try {
      const isEnabled = await this.service.isFeatureEnabled(this.flagName, this.live);
      const shouldShow = this.negate ? !isEnabled : isEnabled;

      this.viewContainer.clear();
      this.hasView = false;

      if (shouldShow) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
        this.hasView = true;
      }
    } catch (error) {
      console.error('Error evaluating feature flag:', error);
      // On error, show the else template if available
      if (this.elseTemplateRef) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
        this.hasView = true;
      }
    }
  }
} 