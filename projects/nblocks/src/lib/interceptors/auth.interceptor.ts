import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth header if we have a token
    const token = this.tokenService.getStoredAccessToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return from(this.handleRequest(request, next));
  }

  private async handleRequest(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    try {
      // Try the request
      return await lastValueFrom(next.handle(request));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Token might be expired, try to refresh
        await this.tokenService.refreshToken();
        
        // Retry the original request with new token
        const newToken = this.tokenService.getStoredAccessToken();
        if (newToken) {
          const newRequest = this.addToken(request, newToken);
          return await lastValueFrom(next.handle(newRequest));
        }
      }
      throw error;
    }
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
} 