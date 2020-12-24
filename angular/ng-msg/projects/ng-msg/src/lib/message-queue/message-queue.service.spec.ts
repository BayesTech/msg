import { TestBed } from '@angular/core/testing';

import { MessageQueueService } from './message-queue.service';

describe('MessageQueueService', () => {
  let service: MessageQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
