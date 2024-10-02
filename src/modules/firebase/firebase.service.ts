import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL'
      );
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      const storageBucket = this.configService.get<string>(
        'FIREBASE_STORAGE_BUCKET'
      );

      console.log(privateKey, privateKey, clientEmail, storageBucket);

      const firebaseParams: ServiceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      admin.initializeApp({
        credential: admin.credential.cert(firebaseParams),
        storageBucket,
      });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file to Firebase:', error);
      throw new Error('File upload failed');
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileName);

    try {
      await file.delete();
      console.log(`File ${fileName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting file from Firebase:', error);
      throw new Error('File deletion failed');
    }
  }
}
