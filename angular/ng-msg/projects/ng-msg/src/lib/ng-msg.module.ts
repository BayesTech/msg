import { NgModule } from '@angular/core';
import { IframeService } from './iframe/iframe.service';
import { MessageQueueService } from './message-queue/message-queue.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    IframeService,
    MessageQueueService
  ]
})
export class NgMsgModule { }
