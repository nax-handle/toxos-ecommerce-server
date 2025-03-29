import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleConfig {
  public readonly clientId: string;
  public readonly clientSecret: string;
  public readonly redirectUri: string;
  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    this.clientSecret =
      this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
    this.redirectUri =
      this.configService.get<string>('GOOGLE_CALLBACK_URL') || '';
  }
}
