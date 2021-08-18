import {
    Controller,
    Post,
    UseGuards,
    Req,
    Res,
    HttpStatus, HttpCode
} from '@nestjs/common';
import { UserLoginInputDto } from './dto/user-login-input.dto';
import {
    ApiBody, ApiCookieAuth, ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { LoginAuthGuard } from './guards';
import { AppConfigService } from '@symbiota2/api-config';

import { Request, Response } from 'express';
import { RefreshCookieStrategy } from './strategies/refresh-cookie.strategy';
import { RefreshCookieGuard } from './guards';
import { TokenService } from '../user/services/token/token.service';
import { AccessTokenOutputDto } from './dto/access-token-output.dto';
import { AuthenticatedRequest } from './dto/authenticated-request';
import { UserService } from '../user/services/user/user.service';

/**
 * Routes for authenticating users
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    // TODO: Implement refresh uid & remove jwt guard for /refresh
    private static readonly MAX_COOKIE_DAYS = 30;

    constructor(
        private readonly users: UserService,
        private readonly appConfig: AppConfigService,
        private readonly tokens: TokenService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LoginAuthGuard)
    @ApiBody({ type: UserLoginInputDto })
    @ApiOperation({
        summary: "Retrieve an access token and refresh cookie given a username and password",
        description: "Creates and issues an access token for use with the " +
            "API. Sets a cookie with a refresh token for retrieving new " +
            "access tokens."
    })
    @ApiResponse({ status: HttpStatus.OK, type: AccessTokenOutputDto })
    async login(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: Response): Promise<AccessTokenOutputDto> {

        const user = await this.users.findByLogin(
            req.user.username,
            ['uid', 'username', 'firstName']
        );

        const [accessToken, refreshToken] = await Promise.all([
            this.tokens.createAccessToken(user),
            this.tokens.createRefreshToken(user.uid)
        ]);
        await this.setRefreshCookie(req, res, refreshToken);
        return { accessToken };
    }

    @Post('refresh')
    @UseGuards(RefreshCookieGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Use a refresh cookie to retrieve a new access token",
        description: "Issues a new access token if the request contains a " +
            "valid refresh cookie"
    })
    @ApiResponse({ status: HttpStatus.OK, type: AccessTokenOutputDto })
    @ApiCookieAuth()
    async refreshUser(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res): Promise<AccessTokenOutputDto> {

        const user = await this.users.findByLogin(
            req.user.username,
            ['uid', 'username', 'firstName']
        );

        const [accessToken, refreshToken] = await Promise.all([
            this.tokens.createAccessToken(user),
            this.tokens.updateRefreshToken(user.uid, req.clientID)
        ]);
        await this.setRefreshCookie(req, res, refreshToken);
        return { accessToken };
    }

    @Post('logout')
    @UseGuards(RefreshCookieGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiCookieAuth()
    @ApiOperation({
        summary: "Destroy the refresh token for the current user/clientID pair",
        description: "Destroys the user's refresh tokens in the database and " +
            "clears their refresh token cookie"
    })
    async logout(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: Response): Promise<void> {

        const user = await this.users.findByLogin(req.user.username);

        await this.tokens.deleteRefreshToken(user.uid, req.clientID);
        res.clearCookie(RefreshCookieStrategy.COOKIE_NAME);
    }

    /**
     * Sets a refresh cookie in the given response based on the given request
     * and refresh token
     */
    private async setRefreshCookie(req: Request, res: Response, refreshToken: string): Promise<void> {
        const isDev = this.appConfig.isDevelopment();
        res.cookie(
            RefreshCookieStrategy.COOKIE_NAME,
            refreshToken,
            {
                httpOnly: true,
                secure: !isDev,
                expires: this.maxCookieDate,
                domain: req.hostname,   // TODO: We should set this in the app config
                sameSite: 'none'
            }
        );
    }

    /**
     * Retrieves the cookie expiration date
     */
    get maxCookieDate(): Date {
        const date = new Date();
        date.setDate(date.getDate() + AuthController.MAX_COOKIE_DAYS);
        return date;
    }
}
