// verification.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name)
    private readonly verificationCodeModel: Model<User>
  ) {}

  // Generate a 6-digit random code
  generateCode(): string {
    return crypto.randomInt(1000, 9999).toString();
  }

  // Store the code in the database
  async storeCode(phoneNumber: string, code: string): Promise<void> {
    const existingRecord = await this.verificationCodeModel.findOne({
      phone_number: phoneNumber,
    });

    if (existingRecord) {
      // Update existing record with new code
      existingRecord.code = code;
      existingRecord.isVerified = false;
      await existingRecord.save();
    } else {
      // Create new record

      await this.verificationCodeModel.findOneAndUpdate(
        { phone_number: phoneNumber },
        { code, isVerified: false }
      );
    }
  }

  // Verify the code provided by the user
  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const verificationRecord = await this.verificationCodeModel.findOne({
      phone_number: phoneNumber,
      code,
    });

    if (!verificationRecord) {
      throw new BadRequestException('Invalid verification code.');
    }

    if (verificationRecord.isVerified) {
      throw new BadRequestException('Verification code already used.');
    }

    // Mark the code as verified
    verificationRecord.isVerified = true;
    await verificationRecord.save();

    return true;
  }
}
