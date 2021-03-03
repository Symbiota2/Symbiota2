import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ImageTag } from './ImageTag.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('sortorder', ['sortOrder'])
@Entity('imagetagkey')
export class ImageTagKey extends EntityProvider {
    @Column('varchar', { primary: true, name: 'tagkey', length: 30 })
    tagKey: string;

    @Column('varchar', { name: 'shortlabel', length: 30 })
    shortLabel: string;

    @Column('varchar', { name: 'description_en', length: 255 })
    descriptionEn: string;

    @Column('int', { name: 'sortorder' })
    sortOrder: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => ImageTag, (imagetag) => imagetag.keyValue)
    tags: Promise<ImageTag[]>;
}
