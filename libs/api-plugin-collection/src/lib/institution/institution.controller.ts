import {
    Body,
    Controller, Delete,
    Get, HttpCode, HttpStatus, NotFoundException,
    Param, Patch, Post,
    Query,
    SerializeOptions, UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import { InstitutionService } from "./institution.service";
import { InstitutionFindAllParams } from './dto/inst-find-all.input.dto';
import { Institution } from '@symbiota2/api-database';
import { InstitutionBodyDto } from './dto/institution-body.dto';
import { JwtAuthGuard, SuperAdminGuard } from '@symbiota2/api-auth';

@Controller('institutions')
@ApiTags('Institutions')
export class InstitutionController {
    constructor(private readonly institutions: InstitutionService) { }

    @Get()
    @ApiOperation({
        summary: "Retrieve a list of specimen collection owners from the database"
    })
    @SerializeOptions({ groups: ['list'] })
    async findAll(@Query() query: InstitutionFindAllParams): Promise<Institution[]> {
        return this.institutions.findAll(query);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Add a new specimen collection owner" })
    @ApiResponse({ status: HttpStatus.OK, type: Institution })
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['single'] })
    async create(@Body() institutionData: InstitutionBodyDto): Promise<Institution> {
        return this.institutions.create(institutionData);
    }

    @Get(':id')
    @ApiOperation({ summary: "Retrieve a specimen collection owner by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: Institution })
    @SerializeOptions({ groups: ['single'] })
    async findByID(@Param('id') institutionID: number): Promise<Institution> {
        const institution = await this.institutions.findByID(institutionID);
        if (!institution) {
            throw new NotFoundException();
        }
        return institution;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    @ApiOperation({ summary: "Update an institution by ID" })
    @ApiResponse({ status: HttpStatus.OK, type: Institution })
    @ApiBearerAuth()
    @SerializeOptions({ groups: ['single', 'update'] })
    async updateByID(@Param('id') institutionID: number, @Body() data: InstitutionBodyDto): Promise<Institution> {
        const institution = await this.institutions.update(institutionID, data);
        if (!institution) {
            throw new NotFoundException();
        }
        return institution;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, SuperAdminGuard)
    @ApiOperation({ summary: "Delete an institution by ID" })
    @ApiBearerAuth()
    async deleteByID(@Param('id') institutionID: number): Promise<void> {
        const success = await this.institutions.deleteByID(institutionID);
        if (!success) {
            throw new NotFoundException();
        }
    }
}
