import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
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
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
