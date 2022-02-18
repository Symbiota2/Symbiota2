import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class KnowledgeGraph {
    constructor(archiveData: Record<string, unknown>) {
        Object.assign(this, archiveData);
    }

    @ApiProperty()
    @Expose()
    graphID: number;

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
