import {
    Body,
    Controller, Delete,
    Get, HttpCode, HttpStatus,
    Inject, NotFoundException,
    Param,
    Post,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { RoleOutputDto } from '../../dto/role.output.dto';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleInputDto } from '../../dto/role.input.dto';
import { UserRole } from '@symbiota2/api-database';
import { CurrentUserGuard } from '../../../auth/guards/current-user.guard';
import { SuperAdminGuard } from '../../../auth/guards/super-admin/super-admin.guard';

@ApiTags('Users')
//@UseGuards(JwtAuthGuard)
//@ApiBearerAuth()
@Controller('users/:id/roles')
export class UserRoleController {
    constructor(
        @Inject(UserRole.PROVIDER_ID)
        private readonly roleRepo: Repository<UserRole>) { }

    @Get()
    @ApiOperation({
        summary: "Return a list of roles for a user",
        description: "Only available to the user or a user with the 'SuperAdmin' role"
    })
    //@UseGuards(CurrentUserGuard)
    @ApiResponse({ status: HttpStatus.OK, type: RoleOutputDto, isArray: true })
    async findAll(@Param('id') uid: number): Promise<RoleOutputDto[]> {
        const roles = await this.roleRepo.find({ uid });
        return roles.map((role) => new RoleOutputDto(role));
    }

    @Post()
    @ApiOperation({
        summary: "Add a role to a user",
        description: "Only available to users with the 'SuperAdmin' role"
    })
    @UseGuards(SuperAdminGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: RoleOutputDto, isArray: true })
    async addRole(
        @Param('id') uid: number,
        @Body() roleData: RoleInputDto): Promise<RoleOutputDto[]> {

        const role = await this.roleRepo.create({ uid, ...roleData });
        await this.roleRepo.save(role);

        const allRoles = await this.roleRepo.find({ uid });
        return allRoles.map((role) => new RoleOutputDto(role));
    }

    @Delete(':roleID')
    @ApiOperation({
        summary: "Remove a role from a user",
        description: "Only available to users with the 'SuperAdmin' role"
    })
    @UseGuards(SuperAdminGuard)
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
