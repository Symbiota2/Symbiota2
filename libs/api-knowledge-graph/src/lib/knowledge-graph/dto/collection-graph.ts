import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CollectionGraph {
    constructor(archiveData: Record<string, unknown>) {
        Object.assign(this, archiveData);
    }

    @ApiProperty()
    @Expose()
    collectionID: number;

    @ApiProperty()
    @Expose()
    graph: string;

    @ApiProperty()
    @Expose()
    isPublic: boolean;

    @ApiProperty()
    @Expose()
    updatedAt: Date;

    @ApiProperty()
    @Expose()
    size: number;
}
