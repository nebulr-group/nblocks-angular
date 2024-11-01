import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {
  constructor(
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  /**
   * Launch the team management UI in a new window
   */
  async launchTeamManagement(): Promise<void> {
    const url = await this.getTeamManagementUrl();
    window.open(url, '_blank');
  }

  /**
   * Get the team management URL (if you want to embed it in an iframe)
   */
  async getTeamManagementUrl(): Promise<string> {
    const token = this.tokenService.getStoredAccessToken();
    if (!token) {
      throw new Error('User must be authenticated to access team management');
    }

    try {
      // Get handover code from nBlocks
      const response = await firstValueFrom(
        this.http.post<{ code: string }>(
          `${this.config.authBaseUrl}/handover/code/${this.config.appId}`,
          { accessToken: token },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (!response.code) {
        throw new Error('Failed to get handover code');
      }

      // Create the team management URL with the handover code
      const baseUrl = this.config.teamManagementUrl || 'https://backendless.nblocks.cloud/user-management-portal/users';
      return `${baseUrl}?code=${response.code}`;
    } catch (error) {
      console.error('Failed to get team management URL:', error);
      throw new Error('Failed to initialize team management: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
} 