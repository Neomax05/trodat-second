// sms.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  sendSms(phoneNumber: string, messageText: string): Promise<string> {
    const options = {
      method: 'POST',
      hostname: 'nm8eej.api.infobip.com',
      path: '/sms/2/text/advanced',
      headers: {
        Authorization:
          'App d0441b966253cc899370e96b8c719b6a-28d2dbaf-f2c4-499e-8877-5fbda3fb1053',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      maxRedirects: 20,
    };

    const postData = JSON.stringify({
      messages: [
        {
          destinations: [{ to: phoneNumber }],
          from: '447491163443', // Sender ID
          text: messageText,
        },
      ],
    });

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks: Uint8Array[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          this.logger.log(`Response from Infobip: ${body.toString()}`);
          resolve(body.toString());
        });

        res.on('error', (error) => {
          this.logger.error(`Error from Infobip: ${error.message}`);
          reject(error);
        });
      });

      req.write(postData);
      req.end();
    });
  }
}
