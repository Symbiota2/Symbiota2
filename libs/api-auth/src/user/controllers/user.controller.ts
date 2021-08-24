import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Query,
    SerializeOptions,
    UseGuards,
    Patch,
    Body,
    ForbiddenException,
    HttpCode,
    Post,
    Req, BadRequestException, UnauthorizedException, Delete
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { UserService } from '../services/user/user.service';
import {
    UserOutputDto
} from '../dto/user.output.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUserGuard } from '../../auth/guards/current-user.guard';
import { UserInputDto } from "../dto/user.input.dto";
import { ChangePasswordInputDto } from '../dto/changePassword.input.dto';
import { SuperAdminGuard } from '../../auth/guards/super-admin/super-admin.guard';
import { FindAllQuery } from '../dto/find-all-query.dto';
import { CreateUserInputDto } from '../dto/create-user.input.dto';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_ID_FORGOT_PASSWORD } from '../services/queues/forgot-password.queue';
import { Queue } from 'bull';
import { ForgotPasswordInputDto } from '../dto/forgot-password.input.dto';
import { AuthenticatedRequest, TokenService } from '@symbiota2/api-auth';
import { ForgotUsernameInputDto } from '../dto/forgot-username.input.dto';
import { QUEUE_ID_FORGOT_USERNAME } from '../services/queues/forgot-username.queue';
import { NotificationService } from '../services/notification/notification.service';
import { UserNotification } from '@symbiota2/api-database';

/**
 * Routes for getting/setting user data
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly notificationService: NotificationService,
        @InjectQueue(QUEUE_ID_FORGOT_PASSWORD) private readonly forgotPasswordQueue: Queue,
        @InjectQueue(QUEUE_ID_FORGOT_USERNAME) private readonly forgotUsernameQueue: Queue,) { }

    @Post()
    @ApiOperation({
        summary: "Create a new user",
        description: "Corresponds to the 'create user' page in the UI"
    })
    @ApiResponse({ status: HttpStatus.OK, type: UserOutputDto })
    async createUser(@Body() userData: CreateUserInputDto): Promise<UserOutputDto> {
        const user = await this.userService.createProfile(userData);
        return new UserOutputDto(user);
    }

    /**
     *
     */
    @Get()
    @ApiOperation({
        summary: "Retrieve a list of users from the database",
        description: "Only available to users with the 'SuperAdmin' role"
    })
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: UserOutputDto, isArray: true })
    @SerializeOptions({ groups: [UserOutputDto.GROUP_LIST] })
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    async findAll(@Query() query?: FindAllQuery): Promise<UserOutputDto[]> {
        if (query && query.username) {
            const user = await this.userService.findByLogin(query.username);
            return [new UserOutputDto(user)];
        }

        const users = await this.userService.findAll();
        return users.map((user) => new UserOutputDto(user));
    }

    @Get(':id')
    @ApiOperation({
        summary: "Return a specific user's profile by ID",
        description: "Only be available to the user or a user with the 'SuperAdmin' role"
    })
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: UserOutputDto })
    @UseGuards(JwtAuthGuard, CurrentUserGuard)
    @SerializeOptions({ groups: [UserOutputDto.GROUP_SINGLE] })
    async findByID(@Param('id') id: number): Promise<UserOutputDto> {
        const user = await this.userService.findByID(id);
        return new UserOutputDto(user);
    }

    @Patch(':id')
    @ApiOperation({
        summary: "Update a specific user's profile by ID",
        description: "Only available to the user or a user with the 'SuperAdmin' role"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, CurrentUserGuard)
    @SerializeOptions({ groups: [UserOutputDto.GROUP_SINGLE] })
    @ApiResponse({ type: UserOutputDto })
    async updateUser(@Param('id') id: number, @Body() userData: UserInputDto): Promise<UserOutputDto> {
        const user = await this.userService.patchProfileData(id, userData);
        return new UserOutputDto(user);
    }

    @Patch(':id/changePassword')
    @ApiOperation({
        summary: "Update a specific user's password by ID",
        description: "Only available to the user or a user with the 'SuperAdmin' role"
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, CurrentUserGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async changePassword(@Req() request: AuthenticatedRequest, @Body() passwdData: ChangePasswordInputDto): Promise<void> {
        const isSuperAdmin = await TokenService.isSuperAdmin(request.user);
        const usernameMatches = request.user.username === passwdData.username;

        if (!(isSuperAdmin || usernameMatches)) {
            throw new ForbiddenException("Cannot edit this user's password");
        }

        const email = await this.userService.resetPassword(
            passwdData.username,
            passwdData.newPassword
        );

        if (!email) {
            throw new BadRequestException('User not found');
        }
    }

    @Post('forgotPassword')
    @ApiOperation({ summary: 'Post with a username to receive a password reset email' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async forgotPassword(@Body() { username }: ForgotPasswordInputDto): Promise<void> {
        await this.forgotPasswordQueue.add({ username });
    }

    @Post('forgotUsername')
    @ApiOperation({ summary: 'Post with an email address to receive a username email' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async forgotUsername(@Body() { email }: ForgotUsernameInputDto): Promise<void> {
        await this.forgotUsernameQueue.add({ email });
    }
}
