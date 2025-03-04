import { LoginDto } from '../dto/login.dto';
import { ILoginStrategy } from './login-strategy.interface';
import { OAuth2Client } from 'google-auth-library';
import { GoogleConfig } from 'src/configs/google.config';
export class GoogleLoginStrategy implements ILoginStrategy {
  private oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new OAuth2Client(GoogleConfig);
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { code } = loginDto;
    const token = await this.oauth2Client.getToken(code);
    const idToken = token.tokens.id_token;
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: idToken as string,
      audience: GoogleConfig.clientId,
    });

    const payload = ticket.getPayload();
    //create user if not exists
    console.log(payload);
    return `Logged in with Google. User: ${payload?.email}`;
  }
}
