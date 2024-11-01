import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { FeatureFlagService } from '../services/feature-flag.service';

export const featureFlagGuard = (flagName: string): CanActivateFn => {
  return async (route, state) => {
    const router = inject(Router);
    const featureFlagService = inject(FeatureFlagService);

    const isEnabled = await featureFlagService.isFeatureEnabled(flagName, true);
    
    if (!isEnabled) {
      await router.navigate(['/']); // Redirect to home if feature is disabled
      return false;
    }

    return true;
  };
}; 