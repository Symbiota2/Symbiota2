import {
    Body,
    Controller, Delete,
    Get, HttpStatus,
    Inject, NotFoundException,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { RoleOutputDto } from '../dto/role.output.dto';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleInputDto } from '../dto/role.input.dto';
import { CurrentUserGuard } from '../../auth/guards/current-user.guard';
import { UserRole } from '@symbiota2/api-database';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, CurrentUserGuard)
@ApiBearerAuth()
@Controller('users/:id/roles')
export class UserRoleController {
    constructor(
        @Inject(UserRole.PROVIDER_ID)
        private readonly roleRepo: Repository<UserRole>) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: RoleOutputDto, isArray: true })
    async findAll(@Param('id') uid: number): Promise<RoleOutputDto[]> {
        const roles = await this.roleRepo.find({ uid });
        return roles.map((role) => new RoleOutputDto(role));
    }

    @Post()
    @ApiResponse({ status: HttpStatus.OK, type: RoleOutputDto, isArray: true })
    async addRole(
        @Param('id') uid: number,
        @Body() roleData: RoleInputDto): Promise<RoleOutputDto[]> {

        await this.roleRepo.create({ uid, ...roleData });

        const allRoles = await this.roleRepo.find({ uid });
        return allRoles.map((role) => new RoleOutputDto(role));
    }

    @Delete(':roleID')
    @ApiResponse({ status: HttpStatus.OK, type: RoleOutputDto, isArray: true })
    async removeRole(
        @Param('id') uid: number,
        @Param('roleID') id: number) {

        const result = await this.roleRepo.delete({ id, uid });
        if (!result.affected) {
            throw new NotFoundException();
        }

        return this.findAll(uid);
    }
}
