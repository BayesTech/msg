import { InjectionToken } from '@angular/core';
import { IframeServiceBase } from './iframe-service-base';

export class IframeOptions {
  public defaultTargetWindow?: Window;
  public defaultTargetUri: string = '';
  public injectionTokens: InjectionToken<IframeServiceBase>[] = [];
}
