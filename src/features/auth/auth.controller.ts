import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppRequest } from '../../types';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  login(@Request() req: AppRequest) {
    return this.authService.login(req.user!);
  }
}
