import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, firstValueFrom } from 'rxjs';
import { NblocksClientService } from './nblocks-client.service';
import { TokenService } from './token.service';
import { LogService } from './log.service';
import { BulkEvaluationResponse, FlagContext } from '@nebulr-group/nblocks-ts-client';
import { FlagsManager } from '../core/flags-manager';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  private flagsStorageSubject = new BehaviorSubject<BulkEvaluationResponse | undefined>(undefined);
  flagsStorage$: Observable<BulkEvaluationResponse | undefined> = this.flagsStorageSubject.asObservable();

  private flagsManager: FlagsManager;

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private logService: LogService    
  ) {    
    this.flagsManager = new FlagsManager({
      getFlagsClient: () => this.nblocksClientService.getNblocksClient().flag,
      onFlagsUpdated: (flags) => this.flagsStorageSubject.next(flags),
      onLog: (message) => this.logService.log(message),
      onError: (error) => {
        this.logService.logError('Flag evaluation failed:', error);
        console.error(error);
      }
    });

    this.tokenService.accessToken$.subscribe(token => {
      this.evaluateFlags();
    });    
  }

  setContext(ctx: FlagContext | undefined): void {
    this.flagsManager.setContext(ctx);
    this.evaluateFlags();
  }

  flagEnabled(flagKey: string): boolean {
    return this.flagsManager.flagEnabled(flagKey);
  }

  initializeFlagStorage(): Observable<void> {
    return from(this.evaluateFlags());
  }

  private async evaluateFlags(): Promise<void> {
    const accessToken = await firstValueFrom(this.tokenService.accessToken$);
    await this.flagsManager.evaluateFlags(accessToken);
  }
}
