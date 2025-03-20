export interface WebhookHandler {
  handle(event: any): Promise<string[]>;
}
