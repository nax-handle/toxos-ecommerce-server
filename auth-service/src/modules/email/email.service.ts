import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailToShopDto } from './dto/send-mail-to-shop.dto';
import { ShopService } from '../shop/shop.service';
@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private shopService: ShopService,
  ) {}

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
  async sendEmailToShop(sendEmailToShop: SendEmailToShopDto) {
    const { shopId, subject, content } = sendEmailToShop;
    const email = await this.shopService.findEmailShop(shopId);
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      context: {
        name: email,
      },
      text: content,
    });
  }
}
