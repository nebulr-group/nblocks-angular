import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NblocksClientService } from './nblocks-client.service';
import { TokenService } from './token.service';
import { LogService } from './log.service';
import { BulkEvaluationResponse, FlagContext } from '@nebulr-group/nblocks-ts-client';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  private flagsStorageSubject = new BehaviorSubject<BulkEvaluationResponse | undefined>(undefined);
  flagsStorage$: Observable<BulkEvaluationResponse | undefined> = this.flagsStorageSubject.asObservable();

  private context: FlagContext | undefined;

  constructor(
    private nblocksClientService: NblocksClientService,
    private tokenService: TokenService,
    private logService: LogService
  ) {
    this.tokenService.accessToken$.subscribe(() => {
      this.doBulkEvaluation();
    });
  }

  setContext(ctx: FlagContext | undefined) {
    this.context = ctx;
    this.doBulkEvaluation();
  }

  flagEnabled(flagKey: string): boolean {
    const flagsStorage = this.flagsStorageSubject.getValue();
    if (!flagsStorage) {
      return false;
    }
    return flagsStorage.flags.some(flag => flag.flag === flagKey && flag.evaluation.enabled);
  }

  private async doBulkEvaluation() {
    try {
      const accessToken = await this.tokenService.accessToken$.toPromise();
      if (!accessToken) {
        return;
      }
      const nblocksClient = this.nblocksClientService.getNblocksClient();
      const response = await nblocksClient.flag.bulkEvaluate({ accessToken, context: this.context });
      this.logService.log("Got new flags!");
      this.flagsStorageSubject.next(response);
    } catch (error) {
      console.error(error);
    }
  }
}
