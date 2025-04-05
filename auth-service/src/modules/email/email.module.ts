import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ShopModule } from '../shop/shop.module';
import { EmailController } from './email.controller';

@Module({
  imports: [
    ShopModule,
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        service: 'gmail',
        // host: 'smtp.com',
        secure: false,
        auth: {
          user: 'it.connected.noreply@gmail.com',
          pass: 'cltz iebl luwr nuqw',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
