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
import {
    IsArray, IsInt,
    IsNumber, IsNumberString,
    IsOptional,
    IsString, Max,
    Min
} from 'class-validator';
import { Type } from 'class-transformer';

class FindAllQuery {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    'username[]'?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false, type: String, isArray: true })
    'email[]'?: string[];

    @ApiProperty({ type: 'number', required: false, default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(25)
    @IsOptional()
    limit = 10;

    @ApiProperty({ type: 'number', required: false, default: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    offset = 0;
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
    async findAll(@Query() query?: FindAllQuery): Promise<UserOutputDto[]> {
        if (query) {
            if (query.username) {
                const user = await this.userService.findByLogin(query.username);
                return [new UserOutputDto(user)];
            }
        }

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
