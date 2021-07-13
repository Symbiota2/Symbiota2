import {
    Controller,
    Get,
    Param,
    Query,
    SerializeOptions
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InstitutionService } from "./institution.service";
import { InstitutionFindAllParams } from './dto/inst-find-all.input.dto';
import { Institution } from '@symbiota2/api-database';

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

    @Get(':id')
    @ApiOperation({
        summary: "Retrieve a specimen collection owner by ID"
    })
    @SerializeOptions({ groups: ['single'] })
    async findByID(@Param('id') institutionID: number): Promise<Institution> {
        return this.institutions.findByID(institutionID);
    }
}
