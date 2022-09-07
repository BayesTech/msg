import { NgMsgRequestMethod } from './ng-msg-request-method';

export abstract class NgMsgBaseService {
  protected getRouteKey(route: string, method: NgMsgRequestMethod): string {
    return `${NgMsgRequestMethod[method]}-${route}`;
  }
}
