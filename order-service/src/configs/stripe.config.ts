import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfig {
  constructor(private readonly configService: ConfigService) {}

  getConfig() {
    return {
      stripeSuccessUrl: this.configService.get<string>('STRIPE_SUCCESS_URL'),
      stripeCancelUrl: this.configService.get<string>('STRIPE_CANCEL_URL'),
      stripeSecretKey: this.configService.get<string>('STRIPE_SECRET_KEY'),
      stripeEndpointKey: this.configService.get<string>('STRIPE_ENDPOINT_KEY'),
    };
  }
}
