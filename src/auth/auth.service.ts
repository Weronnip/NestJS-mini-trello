/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: Omit<AuthDto, 'username'>): Promise<any> {
    console.log('Attempting to validate user');
    console.log('Email:', login.email);
    console.log('Plain Password:', login.password);

    const user = await this.usersService.findOneByUser(login.email);
    console.log('User found:', user);

    if (user) {
      const isMatch = await bcrypt.compare(login.password, user.password);
      console.log('Password match:', isMatch);

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUserByJWT(payload: any): Promise<any> {
    const user = await this.usersService.findOneByUser(payload.sub);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(auth: AuthDto): Promise<any> {
    console.log('Starting registration process...');
    const { username, email, password } = auth;

    if (!username || !email || !password) {
      console.log('Missing required fields');
      throw new BadRequestException(
        'All fields (username, email, plainPassword) are required',
      );
    }

    const existingUser = await this.usersService.findOneByUser(email);
    console.log('Checked existing user:', existingUser);
    if (existingUser) {
      console.log('User already exists');
      throw new ConflictException('Username already exists');
    }

    console.log('Inserting user data into the database...');
    try {
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');

      console.log('Creating user...');
      const newUserRecord = await this.usersService.createUser({
        username,
        email,
        password: hashedPassword,
      });
      console.log('New user record:', newUserRecord);

      return { message: 'User successfully registered', user: newUserRecord };
    } catch (error) {
      console.error('Error during registration process:', error);
      throw new BadRequestException('Failed to hash password');
    }
  }
}
