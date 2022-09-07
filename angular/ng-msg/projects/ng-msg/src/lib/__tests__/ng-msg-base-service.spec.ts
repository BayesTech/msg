import { NgMsgBaseService } from '../ng-msg-base-service';
import { NgMsgRequestMethod } from '../ng-msg-request-method';

class NgMsgTestService extends NgMsgBaseService {
  getRouteKeyWrapper(route: string, method: NgMsgRequestMethod): string {
    return super.getRouteKey(route, method);
  }
}

describe('NgMsgBaseService', () => {
  describe('getRouteKey', () => {
    it('should get route key', () => {
      const baseService = new NgMsgTestService();
      const routeKey = baseService.getRouteKeyWrapper(
        'route',
        NgMsgRequestMethod.PATCH
      );
      expect(routeKey).toEqual('PATCH-route');
    });
  });
});
