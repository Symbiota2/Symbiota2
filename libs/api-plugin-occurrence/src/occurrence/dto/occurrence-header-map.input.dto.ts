import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiOccurrenceMapUploadFieldsBody } from '@symbiota2/data-access';

export class OccurrenceHeaderMapBody implements ApiOccurrenceMapUploadFieldsBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    uniqueIDField: string;

    @ApiProperty()
    @IsObject()
    fieldMap: Record<string, string>;
}
