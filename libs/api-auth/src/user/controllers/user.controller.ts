import {
    Controller,
    Get,
    HttpStatus, Param,
    Query,
    SerializeOptions, UseGuards, Patch, Body, ForbiddenException, HttpCode, Post
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
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

/**
 * Routes for getting/setting user data
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

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
    async changePassword(
        @Param('id') id: number,
        @Body() passwdData: ChangePasswordInputDto): Promise<void> {

        const err = await this.userService.changePassword(
            id,
            passwdData.oldPassword,
            passwdData.newPassword
        );

        if (err) {
            throw new ForbiddenException(err);
        }
    }
}
