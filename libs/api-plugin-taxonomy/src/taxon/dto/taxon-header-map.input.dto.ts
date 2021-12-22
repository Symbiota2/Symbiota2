import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class TaxonHeaderMapBody /*implements ApiOccurrenceMapUploadFieldsBody*/ {
    /*
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    uniqueIDField: string;
     */

    @ApiProperty()
    @IsObject()
    fieldMap: Record<string, string>;
}
