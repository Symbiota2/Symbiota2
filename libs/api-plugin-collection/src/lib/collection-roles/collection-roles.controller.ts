import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CollectionRole,
    CreateCollectionRoleBody
} from '../dto/collection-role';
import { CollectionService } from '../collection.service';
import { ProtectCollection } from '../collection-edit-guard/protect-collection.decorator';

@ApiTags('Collections')
@Controller('collections/:id/roles')
export class CollectionRolesController {
    constructor(private readonly collections: CollectionService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve the roles for the given collection' })
    @ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionRole, isArray: true })
    async findRolesForCollection(@Param('id') id: number): Promise<CollectionRole[]> {
        const roles = await this.collections.getRolesForCollection(id);
        return roles.map((role) => new CollectionRole(role));
    }

    @Post()
    @ApiOperation({ summary: 'Add a role to the given collection' })
    @ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionRole, isArray: true })
    async addRoleToCollection(@Param('id') id: number, @Body() body: CreateCollectionRoleBody): Promise<CollectionRole[]> {
        const roles = await this.collections.addRoleForCollection(id, body.uid, body.role);
        return roles.map((role) => new CollectionRole(role));
    }

    @Delete()
    @ApiOperation({ summary: 'Delete a role from the given collection' })
    @ProtectCollection('id')
    @ApiResponse({ status: HttpStatus.OK, type: CollectionRole, isArray: true })
    async deleteRoleFromCollection(@Param('id') id: number, @Body() body: CreateCollectionRoleBody): Promise<CollectionRole[]> {
        const roles = await this.collections.deleteRoleForCollection(id, body.uid, body.role);
        return roles.map((role) => new CollectionRole(role));
    }
}
