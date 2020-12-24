import { InjectionToken } from '@angular/core';
import { IframeServiceBase } from './iframe-service-base';

export class IframeOptions {
    public defaultTargetUri: string;
    public defaultTargetWindow: Window;
    public injectionTokens: InjectionToken<IframeServiceBase>[];
}