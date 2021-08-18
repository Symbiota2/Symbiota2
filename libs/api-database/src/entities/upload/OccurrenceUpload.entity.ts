import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EntityProvider } from '../../entity-provider.class';
import { ApiOccurrenceUpload } from '@symbiota2/data-access';

export type OccurrenceUploadFieldMap = Record<string, keyof Occurrence>;

@Entity()
@Exclude()
export class OccurrenceUpload extends EntityProvider implements ApiOccurrenceUpload {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    @Expose()
    id: number;

    @Column()
    filePath: string;

    @Column()
    mimeType: string;

    @Column()
    uniqueIDField: string;

    @Column('simple-json', { default: () => "'{}'" })
    @ApiProperty()
    @Expose()
    fieldMap: OccurrenceUploadFieldMap;
}
