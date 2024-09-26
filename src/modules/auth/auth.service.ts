import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async signUp(@Body() signUpDto: SignUpDto) {
    const { password, email, ...signUpUser } = signUpDto;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await this.userModel.create({
      ...signUpUser,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return {
      token,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
  }

  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid email or password');

    const token = this.jwtService.sign({ id: user._id });

    return {
      token,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
    };
  }

  async changeUser(@Body() signUpDto: ChangeAuthValuesDto) {
    const { email } = signUpDto;

    const user = await this.userModel.findOneAndUpdate({ email }, signUpDto);

    const newUser = {
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      avatar: user.avatar,
      role: user.role,
    };

    return newUser;
  }
}
