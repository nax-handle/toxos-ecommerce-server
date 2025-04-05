import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailToShopDto } from './dto/send-mail-to-shop.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @EventPattern('send_email_to_shop')
  create(@Payload() sendEmailToShopDto: SendEmailToShopDto) {
    console.log('send mail cooking!');
    console.log(sendEmailToShopDto);
    return this.emailService.sendEmailToShop(sendEmailToShopDto);
  }
}
