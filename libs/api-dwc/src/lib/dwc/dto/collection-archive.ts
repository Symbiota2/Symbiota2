import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CollectionArchive {
    constructor(archiveData: Record<string, unknown>) {
        Object.assign(this, archiveData);
    }

    @ApiProperty()
    @Expose()
    collectionID: number;

    @ApiProperty()
    @Expose()
    archive: string;

    @ApiProperty()
    @Expose()
    isPublic: boolean;
}
