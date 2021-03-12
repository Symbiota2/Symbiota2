import {
    Controller,
    Get,
    HttpStatus, Param,
    Query,
    SerializeOptions, UseGuards, Patch, Body, ForbiddenException, HttpCode
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiProperty,
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

class FindAllParams {
    @ApiProperty({ required: false })
    username?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    'username[]'?: string[];

    @ApiProperty({ required: false })
    lastName?: string;

    @ApiProperty({ required: false })
    email?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    'email[]'?: string[];

    @ApiProperty({ required: false })
    page?: number;
}

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: UserOutputDto, isArray: true })
    @SerializeOptions({ groups: [UserOutputDto.GROUP_LIST] })
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    async findAll(@Query() params?: FindAllParams): Promise<UserOutputDto[]> {
        const users = await this.userService.findAll();
        return users.map((user) => new UserOutputDto(user));
    }

    @Get(':id')
    @ApiResponse({ status: HttpStatus.OK, type: UserOutputDto })
    @UseGuards(JwtAuthGuard, CurrentUserGuard)
    @SerializeOptions({ groups: [UserOutputDto.GROUP_SINGLE] })
    async findByID(@Param('id') id: number): Promise<UserOutputDto> {
        const user = await this.userService.findByID(id);
        return new UserOutputDto(user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, CurrentUserGuard)
    @SerializeOptions({ groups: [UserOutputDto.GROUP_SINGLE] })
    @ApiResponse({ type: UserOutputDto })
    async updateUser(@Param('id') id: number, @Body() userData: UserInputDto): Promise<UserOutputDto> {
        const user = await this.userService.patchProfileData(id, userData);
        return new UserOutputDto(user);
    }

    @Patch(':id/changePassword')
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
