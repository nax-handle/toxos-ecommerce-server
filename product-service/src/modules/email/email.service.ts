import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, msg: string, subject: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      // template: './confirmation',
      context: {
        name: email,
        msg,
      },
      text: `Có một đánh giá sản phẩm 1 sao xử lý sớm nhất có thể nhé! ${msg}`,
    });
  }
}
