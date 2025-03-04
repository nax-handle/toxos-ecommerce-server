import { Injectable, Inject } from '@nestjs/common';
import { ILoginStrategy } from './login-strategy.interface';
import { EmailLoginStrategy } from './email-login.strategy';
import { GoogleLoginStrategy } from './google-login.strategy';
import { FacebookLoginStrategy } from './facebook-login.strategy';

@Injectable()
export class LoginStrategy {
  private strategies: Record<string, ILoginStrategy>;
  constructor(
    @Inject(EmailLoginStrategy) private emailLogin: EmailLoginStrategy,
    @Inject(GoogleLoginStrategy) private googleLogin: GoogleLoginStrategy,
    @Inject(FacebookLoginStrategy) private facebookLogin: FacebookLoginStrategy,
  ) {
    this.strategies = {
      email: this.emailLogin,
      google: this.googleLogin,
      facebook: this.facebookLogin,
    };
  }
  getStrategy(strategyName: string): ILoginStrategy {
    const strategy = this.strategies[strategyName];
    if (!strategy) {
      throw new Error(`Login strategy ${strategyName} not supported`);
    }
    return strategy;
  }
}

// create(strategyName: string): LoginStrategy {
//   switch (strategyName) {
//     case 'email':
//       return new EmailLoginStrategy();
//     case 'google':
//       return new GoogleLoginStrategy();
//     case 'facebook':
//       return new FacebookLoginStrategy();
//     default:
//       throw new Error(`Login strategy ${strategyName} not supported`);
//   }
// }
