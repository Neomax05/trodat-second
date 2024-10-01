import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Fixed typo here
      secretOrKey: 'abc123', // Replace with process.env.JWT_SECRET or ConfigService for better security
    });
  }

  async validate(payload: any) {
    console.log('Payload:', payload); // Added a more descriptive log message
    return { userId: payload.sub, email: payload.email }; // Return a proper user object
  }
}
