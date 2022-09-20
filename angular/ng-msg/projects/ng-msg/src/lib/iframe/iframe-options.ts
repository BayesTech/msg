import { InjectionToken } from '@angular/core';
import { IframeServiceBase } from './iframe-service-base';

export class IframeOptions {
  public defaultTargetUri: string = '';
  public injectionTokens: InjectionToken<IframeServiceBase>[] = [];

  constructor(public defaultTargetWindow: Window) {}
}
