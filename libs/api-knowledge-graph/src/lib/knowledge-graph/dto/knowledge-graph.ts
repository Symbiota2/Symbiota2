import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class KnowledgeGraph {
    constructor(archiveData: Record<string, unknown>) {
        Object.assign(this, archiveData);
    }

    @ApiProperty()
    @Expose()
    name: string

    @ApiProperty()
    @Expose()
    updatedAt: Date | null

    @ApiProperty()
    @Expose()
    size: number | null
}
