import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';
import { TokenService } from './token.service';

interface SingleFlagResponse {
  enabled: boolean;
}

interface FlagEvaluation {
  enabled: boolean;
}

interface FlagResponse {
  flag: string;
  evaluation: FlagEvaluation;
}

interface BulkFeatureFlagResponse {
  flags: FlagResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private readonly baseUrl = 'https://backendless.nblocks.cloud';
  private cachedFlags: { [key: string]: boolean } = {};
  private lastFetchTime: number = 0;
  private readonly cacheValidityMs = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig,
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  async loadFeatureFlags(): Promise<void> {
    try {
      const accessToken = this.tokenService.getStoredAccessToken();
      if (!accessToken) {
        throw new Error('User must be authenticated to evaluate feature flags');
      }

      const url = `${this.baseUrl}/flags/bulkEvaluate/${this.config.appId}`;
      const response = await firstValueFrom(
        this.http.post<BulkFeatureFlagResponse>(url, {
          accessToken
        })
      );

      // Transform the response into our cached format
      this.cachedFlags = response.flags.reduce((acc, flag) => {
        acc[flag.flag] = flag.evaluation.enabled;
        return acc;
      }, {} as { [key: string]: boolean });

      this.lastFetchTime = Date.now();
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      throw error;
    }
  }

  /**
   * Check if a specific feature flag is enabled
   * @param flagName The name of the feature flag to check
   * @param forceLive If true, bypasses cache and makes a direct API call
   * @returns Promise<boolean> indicating if the feature is enabled
   */
  async isFeatureEnabled(flagName: string, forceLive: boolean = false): Promise<boolean> {
    const currentFlags = this.cachedFlags;
    const isCacheValid = Date.now() - this.lastFetchTime < this.cacheValidityMs;

    // If cache is stale, reload all flags first
    if (!isCacheValid) {
      await this.loadFeatureFlags();
      const updatedFlags = this.cachedFlags;
      
      // If not forcing live check, return from fresh cache
      if (!forceLive) {
        return updatedFlags[flagName] ?? false;
      }
    }

    // If forcing live check, make individual API call
    if (forceLive) {
      try {
        const accessToken = this.tokenService.getStoredAccessToken();
        if (!accessToken) {
          throw new Error('User must be authenticated to evaluate feature flags');
        }

        const url = `${this.baseUrl}/flags/evaluate/${this.config.appId}/${flagName}`;
        const response = await firstValueFrom(
          this.http.post<SingleFlagResponse>(url, {
            accessToken
          })
        );
        
        // Update the cached flags with the live value
        const updatedFlags = {
          ...this.cachedFlags,
          [flagName]: response.enabled
        };
        this.cachedFlags = updatedFlags;
        
        return response.enabled;
      } catch (error) {
        console.error(`Failed to check feature flag ${flagName}:`, error);
        return this.cachedFlags[flagName] ?? false;
      }
    }

    // Return from cache for normal requests
    return currentFlags[flagName] ?? false;
  }

  /**
   * Get all feature flags as an observable
   * Automatically refreshes if cache is stale
   */
  getFeatureFlags(): Observable<{ [key: string]: boolean }> {
    if (Date.now() - this.lastFetchTime >= this.cacheValidityMs) {
      this.loadFeatureFlags();
    }
    return new BehaviorSubject<{ [key: string]: boolean }>(this.cachedFlags);
  }

  /**
   * Get a specific feature flag as an observable
   * Uses cached data and automatically refreshes if stale
   */
  getFeatureFlag(flagName: string): Observable<boolean> {
    if (Date.now() - this.lastFetchTime >= this.cacheValidityMs) {
      this.loadFeatureFlags();
    }
    return new BehaviorSubject<boolean>(this.cachedFlags[flagName] ?? false);
  }

  /**
   * Force refresh the feature flags cache
   */
  async refreshFeatureFlags(): Promise<void> {
    await this.loadFeatureFlags();
  }
} 