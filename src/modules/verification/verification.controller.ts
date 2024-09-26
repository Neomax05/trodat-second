// verification.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SmsService } from './sms.service';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly smsService: SmsService
  ) {}

  @Post('send-code')
  async sendCode(
    @Body('phone_number') phoneNumber: string
  ): Promise<{ message: string }> {
    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required.');
    }

    const code = this.verificationService.generateCode();
    await this.verificationService.storeCode(phoneNumber, code);

    // Send the code via SMS
    const messageText = `Your verification code is: ${code}`;
    await this.smsService.sendSms(phoneNumber, messageText);

    return { message: 'Verification code sent successfully.' };
  }

  @Post('verify-code')
  async verifyCode(
    @Body('phone_number') phoneNumber: string,
    @Body('code') code: string
  ): Promise<{ message: string }> {
    if (!phoneNumber || !code) {
      throw new BadRequestException(
        'Phone number and verification code are required.'
      );
    }

    const isValid = await this.verificationService.verifyCode(
      phoneNumber,
      code
    );

    if (isValid) {
      return { message: 'Verification successful.' };
    } else {
      throw new BadRequestException('Invalid verification code.');
    }
  }
}
