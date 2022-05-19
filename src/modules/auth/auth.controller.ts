import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

// Service
import { UsersService } from '../user/users.service';
import { AuthService } from './auth.service';

// Dto
import { RegisterDto } from './dto/register.dto';

// Guard
import JwtAuthGuard from './guard/jwtAuth.guard';
import { LocalAuthGuard } from './guard/localAuth.guard';
import LoginDto from './dto/login.dto';
import JwtRefreshGuard from './guard/jwtRefresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        let user = await this.authService.register(registrationData);

        return user
    }

    @HttpCode(200)
    @Post('login')
    async logIn(@Req() request, @Body() loginData: LoginDto) {
        const { email, password } = loginData;

        let user = await this.authService.getAuthenticatedUser(email, password);
        const accessTokenData = this.authService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenData = this.authService.getCookieWithJwtRefreshToken(user.id);
    
        await this.usersService.setCurrentRefreshToken(refreshTokenData.token, user.id);
    
        request.res.setHeader('Set-Cookie', [accessTokenData.cookie, refreshTokenData.cookie]);
        return user;
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() request, @Res() response: Response) {
        const {user} = request;
        await this.usersService.removeRefreshToken(user.id);

        request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
        response.sendStatus(200);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request) {
        const {user} = request;
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    
        request.res.setHeader('Set-Cookie', accessTokenCookie.cookie);
        return user;
    }
}