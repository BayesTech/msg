export class MessageQueueConfigurationBase {
  constructor(
    public wssUrl: string,
    public username: string,
    public password: string
  ) {}
}
