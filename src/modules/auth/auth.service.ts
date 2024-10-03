import {
  BadRequestException,
  Body,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcryptjs from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { ChangeAuthValuesDto } from './dto/change.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  hashValue(value: string) {
    return bcryptjs.hash(value, 10);
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashValue(rt);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        hashedRt: hash,
      }
    );
  }

  async getTokens(userId: string, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'abc123',
          expiresIn: 60 * 60 * 24 * 7,
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        }
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async signUp(@Body() signUpDto: SignUpDto) {
    const { password, email, ...signUpUser } = signUpDto;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await this.userModel.create({
      ...signUpUser,
      email,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(
      user._id as unknown as string,
      user.email
    );
    await this.updateRtHash(
      user._id as unknown as string,
      tokens.refresh_token
    );

    return {
      ...tokens,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
  }

  async logout(userId: string) {
    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new UnauthorizedException('not founds');
    }

    return {
      message: 'successfully logout',
    };
  }

  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid email or password');

    const tokens = await this.getTokens(
      user._id as unknown as string,
      user.email
    );
    await this.updateRtHash(
      user._id as unknown as string,
      tokens.refresh_token
    );

    return {
      ...tokens,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
  }

  async changeUser(@Body() changeUserValuesDto: ChangeAuthValuesDto) {
    const { email } = changeUserValuesDto;

    const user = await this.userModel.findOneAndUpdate(
      { email },
      changeUserValuesDto
    );

    const tokens = await this.getTokens(
      user._id as unknown as string,
      user.email
    );

    const newUser = {
      email: changeUserValuesDto.email,
      full_name: changeUserValuesDto.full_name,
      phone_number: changeUserValuesDto.phone_number,
      avatar: changeUserValuesDto.avatar,
      role: user.role,
      ...tokens,
    };

    return newUser;
  }

  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('Invalid verification code.');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Verification code no verified');
    }

    if (user) {
      const hashedPassword = await bcryptjs.hash(newPassword, 10); // Hash the new password
      user.password = hashedPassword; // Update the password
      await user.save(); // Save the user
      return true;
    }

    return false;
  }
}
