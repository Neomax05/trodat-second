// verification.controller.ts

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { VerificationService } from './verification.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly smsService: SmsService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('send-code')
  async sendCode(
    @Req() req: Request,
    @Body('phone_number') phoneNumber: string
  ): Promise<{ message: string }> {
    const userId = req.user['userId'];

    if (!phoneNumber) {
      throw new BadRequestException('Phone number is required.');
    }

    const code = this.verificationService.generateCode();
    await this.verificationService.storeCode(userId, phoneNumber, code);

    // Send the code via SMS
    const messageText = `Your verification code is: ${code}`;
    await this.smsService.sendSms(phoneNumber, messageText);

    return { message: 'Verification code sent successfully.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify-code')
  async verifyCode(
    @Req() req: Request,
    @Body('code') code: string
  ): Promise<{ message: string }> {
    const userId = req.user['userId'];
    if (!code) {
      throw new BadRequestException(
        'Phone number and verification code are required.'
      );
    }

    const isValid = await this.verificationService.verifyCode(userId, code);

    if (isValid) {
      return { message: 'Verification successful.' };
    } else {
      throw new BadRequestException('Invalid verification code.');
    }
  }
}
