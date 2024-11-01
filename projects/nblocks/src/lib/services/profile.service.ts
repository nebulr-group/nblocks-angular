import { Inject, Injectable } from '@angular/core';
import * as jose from 'jose';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { InvalidTokenError, JwksError, TokenExpiredError } from '../errors/token.errors';
import { NblocksConfig } from '../models/nblocks-config.interface';
import { IDToken, Profile } from '../models/profile.interface';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly jwksUrl: string;
  private readonly expectedIssuer: string;
  private readonly expectedAudience: string;
  private jwksClient: ReturnType<typeof jose.createRemoteJWKSet>;

  private profileSubject = new BehaviorSubject<Profile | null>(null);
  readonly profile$ = this.profileSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    @Inject(NBLOCKS_CONFIG) private config: NblocksConfig
  ) {
    if (!config.authBaseUrl) {
      throw new Error('authBaseUrl is required in NblocksConfig');
    }
    if (!config.appId) {
      throw new Error('appId is required in NblocksConfig');
    }

    this.jwksUrl = `${config.authBaseUrl}/.well-known/jwks.json`;
    this.expectedIssuer = config.authBaseUrl;
    this.expectedAudience = config.appId;
    
    // Initialize JWKS client
    this.jwksClient = jose.createRemoteJWKSet(
      new URL(this.jwksUrl)
    );

    // Subscribe to ID token changes
    this.tokenService.idToken$().subscribe(token => {
      if (token) {
        this.verifyAndUpdateProfile(token).catch(error => {
          console.error('Error verifying ID token:', error);
          this.profileSubject.next(null);
        });
      } else {
        this.profileSubject.next(null);
      }
    });
  }

  /**
   * Verifies the ID token and updates the profile
   */
  private async verifyAndUpdateProfile(idToken: string): Promise<void> {
    try {
      const { payload } = await jose.jwtVerify(
        idToken,
        this.jwksClient,
        {
          issuer: this.expectedIssuer,
          audience: this.expectedAudience
        }
      );

      const tokenData = payload as IDToken;
      
      // Transform IDToken into Profile
      const profile: Profile = {
        id: tokenData.sub,
        username: tokenData.preferred_username,
        email: tokenData.email,
        emailVerified: tokenData.email_verified,
        fullName: tokenData.name,
        familyName: tokenData.family_name,
        givenName: tokenData.given_name,
        locale: tokenData.locale,
        onboarded: tokenData.onboarded,
        multiTenantAccess: tokenData.multi_tenant,
        tenant: tokenData.tenant_id ? {
          id: tokenData.tenant_id,
          name: tokenData.tenant_name,
          locale: tokenData.tenant_locale,
          logo: tokenData.tenant_logo,
          onboarded: tokenData.tenant_onboarded
        } : undefined
      };

      this.profileSubject.next(profile);
    } catch (error) {
      this.profileSubject.next(null);
      
      if (error instanceof Error) {
        if (error.name === 'JWTExpired') {
          throw new TokenExpiredError();
        } else if (error.name === 'JWTInvalid') {
          throw new InvalidTokenError(error.message);
        } else if (error.message.includes('JWKS')) {
          throw new JwksError(error.message);
        }
      }
      
      throw new InvalidTokenError('Unknown error during token verification');
    }
  }

  /**
   * Gets the current profile synchronously
   */
  getCurrentProfile(): Profile | null {
    return this.profileSubject.value;
  }

  /**
   * Checks if the current profile has completed onboarding
   */
  isOnboarded(): Observable<boolean> {
    return this.profile$.pipe(
      map(profile => profile?.onboarded ?? false)
    );
  }

  /**
   * Checks if the current profile has multi-tenant access
   */
  hasMultiTenantAccess(): Observable<boolean> {
    return this.profile$.pipe(
      map(profile => profile?.multiTenantAccess ?? false)
    );
  }

  /**
   * Clears the current profile
   */
  clearProfile(): void {
    this.profileSubject.next(null);
  }
} 