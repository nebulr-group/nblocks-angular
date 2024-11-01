import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { NBLOCKS_CONFIG } from '../tokens/nblocks-tokens';

export const protectedRoute: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const config = inject(NBLOCKS_CONFIG);

  const isAuthenticated = await tokenService.isAuthenticated();
  
  if (!isAuthenticated) {
    await router.navigate([config.loginRoute || '/login']);
    return false;
  }

  return true;
}; 