import { BadRequestException, Injectable } from '@nestjs/common';
import { generateOtp } from 'src/utils/generate-otp.util';
import { comparePassword, hashPassword } from 'src/utils/hash.util';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { RedisService } from 'src/database/redis.service';
@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}
  async generateOtp(email: string, password: string): Promise<string> {
    const otp = await generateOtp(6);
    const otpHash = await hashPassword(otp, 10);
    const passwordHash = await hashPassword(password, 10);
    await this.redisService.set(
      `otp:${email}`,
      JSON.stringify({
        otp: otpHash,
        password: passwordHash,
      }),
      60 * 5,
    );
    return otp;
  }
  async verifyOtp({ email, otp }: VerifyOtpDto): Promise<string> {
    const KEY = `otp:${email}`;
    const dataString = await this.redisService.get(KEY);
    if (!dataString) {
      throw new BadRequestException('OTP is expired');
    }
    const { otp: hashedOtp, password } = JSON.parse(dataString) as {
      otp: string;
      password: string;
    };
    const isValid = await comparePassword(otp, hashedOtp);
    if (!isValid) {
      throw new BadRequestException('OTP is invalid');
    }
    await this.redisService.del(KEY);
    return password;
  }
}
