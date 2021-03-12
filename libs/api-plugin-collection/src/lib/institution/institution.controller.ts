import { Controller, Get, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { InstitutionListItem } from "./dto/institution-list-item.output.dto";
import { InstitutionService } from "./institution.service";
import { InstitutionFindAllParams } from './dto/inst-find-all.input.dto';

@Controller('institutions')
@ApiTags('Institutions')
export class InstitutionController {
    constructor(private readonly institutions: InstitutionService) { }

    @Get()
    async findAll(@Query() query: InstitutionFindAllParams): Promise<InstitutionListItem[]> {
        const institutions = await this.institutions.findAll(query);
        return institutions.map((i) => new InstitutionListItem(i));
    }
}