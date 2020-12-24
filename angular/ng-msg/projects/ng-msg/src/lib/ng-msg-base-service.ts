import { NgMsgRequestMethod } from './ng-msg-request-method';

export abstract class NgMsgBaseService {
    protected GetRouteKey(route: string, method: NgMsgRequestMethod): string {
        return `${NgMsgRequestMethod[method]}-${route}`;
    }
}