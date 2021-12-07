import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EntityProvider } from '../../entity-provider.class';

// The taxonomy table contains keys of various tables plus some artificial names so the map value is string
export type TaxonomyUploadFieldMap = Record<string, string>;

@Entity()
@Exclude()
export class TaxonomyUpload extends EntityProvider {
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
    fieldMap: TaxonomyUploadFieldMap;
}
