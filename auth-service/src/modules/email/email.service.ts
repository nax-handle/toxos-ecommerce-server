import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, otp: string, subject: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      // template: './confirmation',
      context: {
        name: email,
        otp,
      },
      text: `Your OTP is ${otp}`,
    });
  }
}
