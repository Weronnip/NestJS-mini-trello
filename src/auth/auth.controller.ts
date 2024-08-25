import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt.guards';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(@Body() login: Omit<AuthDto, 'username'>) {
    if (!login.email || !login.password) {
      throw new BadRequestException('Username and plainPassword are required');
    }

    const user = await this.authService.validateUser({
      email: login.email,
      password: login.password,
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      data: await this.authService.login(user),
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async register(@Body() auth: AuthDto): Promise<any> {
    console.log('\nReceived body:', auth);
    return {
      message: 'Registration successful',
      data: await this.authService.register(auth),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  userProfile(@Request() req) {
    return req.user;
  }
}
